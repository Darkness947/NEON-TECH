// ============================================================
// routes/checkout.js – Checkout + Stripe Integration
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const stripe  = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db      = require('../config/db');
const { sendOrderConfirmation } = require('../config/mailer');

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to checkout.');
  res.redirect('/auth/login');
}

// ── GET /checkout ─────────────────────────────────────────────
router.get('/', requireLogin, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT sc.quantity, p.id AS product_id, p.name_en, p.name_ar, p.price, p.image_path
       FROM ShopCart sc JOIN Products p ON sc.product_id = p.id
       WHERE sc.user_id = ?`,
      [req.session.user.id]
    );

    if (!items.length) {
      req.flash('error', 'Your cart is empty.');
      return res.redirect('/cart');
    }

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);

    res.render('checkout', {
      title:          'Checkout | NEON TECH',
      items,
      subtotal:       subtotal.toFixed(2),
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

// ── POST /checkout/stripe – Create Stripe Session ─────────────
router.post('/stripe', requireLogin, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT sc.quantity, p.id AS product_id, p.name_en, p.price
       FROM ShopCart sc JOIN Products p ON sc.product_id = p.id
       WHERE sc.user_id = ?`,
      [req.session.user.id]
    );

    if (!items.length) return res.redirect('/cart');

    const line_items = items.map(i => ({
      price_data: {
        currency:     'usd',
        product_data: { name: i.name_en },
        unit_amount:  Math.round(i.price * 100)
      },
      quantity: i.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode:        'payment',
      success_url: `${process.env.APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${process.env.APP_URL}/checkout/cancel`,
      customer_email: req.session.user.email,
      metadata: { user_id: String(req.session.user.id) }
    });

    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Payment session failed. Please try again.');
    res.redirect('/checkout');
  }
});

// ── GET /checkout/success ─────────────────────────────────────
router.get('/success', requireLogin, async (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.redirect('/');

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') return res.redirect('/checkout');

    const userId = req.session.user.id;

    // Get cart items
    const [cartItems] = await db.query(
      `SELECT sc.quantity, p.id AS product_id, p.price, p.name_en
       FROM ShopCart sc JOIN Products p ON sc.product_id = p.id
       WHERE sc.user_id = ?`,
      [userId]
    );
    if (!cartItems.length) return res.redirect('/');

    const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

    // Create order
    const [orderResult] = await db.query(
      `INSERT INTO Orders (user_id, total, status, stripe_session_id)
       VALUES (?, ?, 'paid', ?)`,
      [userId, total.toFixed(2), session_id]
    );
    const orderId = orderResult.insertId;

    // Insert order items & update stock
    for (const item of cartItems) {
      await db.query(
        'INSERT INTO OrderItems (order_id, product_id, quantity, unit_price) VALUES (?,?,?,?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
      await db.query(
        'UPDATE Products SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [item.quantity, item.product_id, item.quantity]
      );
    }

    // Clear cart
    await db.query('DELETE FROM ShopCart WHERE user_id = ?', [userId]);
    req.session.cartCount = 0;

    // Send email confirmation (non-blocking)
    try {
      await sendOrderConfirmation(req.session.user, orderId, cartItems, total);
    } catch (mailErr) {
      console.warn('Email notification failed:', mailErr.message);
    }

    res.render('checkout_success', {
      title:   'Order Confirmed | NEON TECH',
      orderId,
      items:   cartItems,
      total:   total.toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

// ── GET /checkout/cancel ──────────────────────────────────────
router.get('/cancel', (req, res) => {
  req.flash('error', 'Payment was cancelled. Your cart is still saved.');
  res.redirect('/cart');
});

module.exports = router;
