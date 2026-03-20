// ============================================================
// routes/cart.js – Shopping Cart (CRUD)
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── Middleware: require login ─────────────────────────────────
function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to manage your cart.');
  res.redirect('/auth/login');
}

// ── Helper: refresh cart count in session ─────────────────────
async function refreshCartCount(req) {
  const [rows] = await db.query(
    'SELECT COALESCE(SUM(quantity),0) AS cnt FROM ShopCart WHERE user_id = ?',
    [req.session.user.id]
  );
  req.session.cartCount = Number(rows[0].cnt);
}

// ── GET /cart ─────────────────────────────────────────────────
router.get('/', requireLogin, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT sc.id AS cart_id, sc.quantity,
              p.id AS product_id, p.name_en, p.name_ar, p.price, p.image_path, p.stock
       FROM ShopCart sc
       JOIN Products p ON sc.product_id = p.id
       WHERE sc.user_id = ?`,
      [req.session.user.id]
    );

    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    res.render('cart', {
      title: 'My Cart | NEON TECH',
      items,
      subtotal: subtotal.toFixed(2)
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

// ── POST /cart/add ────────────────────────────────────────────
router.post('/add', requireLogin, async (req, res) => {
  const product_id = parseInt(req.body.product_id);
  const quantity   = Math.max(1, parseInt(req.body.quantity) || 1);

  if (!product_id) return res.redirect('/');

  try {
    // Check stock
    const [[product]] = await db.query('SELECT stock FROM Products WHERE id = ?', [product_id]);
    if (!product || product.stock < quantity) {
      req.flash('error', 'Not enough stock available.');
      return res.redirect(`/products/${product_id}`);
    }

    // Upsert cart row  (ON DUPLICATE KEY: increment quantity)
    await db.query(
      `INSERT INTO ShopCart (user_id, product_id, quantity)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      [req.session.user.id, product_id, quantity]
    );

    await refreshCartCount(req);
    req.flash('success', 'Item added to cart!');
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not add item to cart.');
    res.redirect(`/products/${product_id}`);
  }
});

// ── POST /cart/update ─────────────────────────────────────────
router.post('/update', requireLogin, async (req, res) => {
  const cart_id  = parseInt(req.body.cart_id);
  const quantity = parseInt(req.body.quantity);

  if (!cart_id || quantity < 1) {
    req.flash('error', 'Invalid update request.');
    return res.redirect('/cart');
  }

  try {
    await db.query(
      'UPDATE ShopCart SET quantity = ? WHERE id = ? AND user_id = ?',
      [quantity, cart_id, req.session.user.id]
    );
    await refreshCartCount(req);
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.redirect('/cart');
  }
});

// ── POST /cart/remove ─────────────────────────────────────────
router.post('/remove', requireLogin, async (req, res) => {
  const cart_id = parseInt(req.body.cart_id);
  if (!cart_id) return res.redirect('/cart');

  try {
    await db.query(
      'DELETE FROM ShopCart WHERE id = ? AND user_id = ?',
      [cart_id, req.session.user.id]
    );
    await refreshCartCount(req);
    req.flash('success', 'Item removed from cart.');
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.redirect('/cart');
  }
});

// ── POST /cart/clear ──────────────────────────────────────────
router.post('/clear', requireLogin, async (req, res) => {
  try {
    await db.query('DELETE FROM ShopCart WHERE user_id = ?', [req.session.user.id]);
    req.session.cartCount = 0;
    res.redirect('/cart');
  } catch (err) {
    console.error(err);
    res.redirect('/cart');
  }
});

module.exports = router;
