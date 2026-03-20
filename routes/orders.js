// ============================================================
// routes/orders.js – Order History
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to view your orders.');
  res.redirect('/auth/login');
}

// ── GET /orders – All orders for current user ─────────────────
router.get('/', requireLogin, async (req, res) => {
  try {
    const [orders] = await db.query(
      'SELECT * FROM Orders WHERE user_id = ? ORDER BY created_at DESC',
      [req.session.user.id]
    );
    res.render('orders/history', { title: 'Order History | NEON TECH', orders });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

// ── GET /orders/:id – Order Detail ────────────────────────────
router.get('/:id', requireLogin, async (req, res) => {
  const orderId = parseInt(req.params.id);
  try {
    const [[order]] = await db.query(
      'SELECT * FROM Orders WHERE id = ? AND user_id = ?',
      [orderId, req.session.user.id]
    );
    if (!order) return res.redirect('/orders');

    const [items] = await db.query(
      `SELECT oi.*, p.name_en, p.name_ar, p.image_path
       FROM OrderItems oi JOIN Products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [orderId]
    );

    res.render('orders/detail', { title: `Order #${orderId} | NEON TECH`, order, items });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

module.exports = router;
