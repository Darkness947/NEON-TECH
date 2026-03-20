// ============================================================
// routes/wishlist.js – Wishlist Management
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to manage your wishlist.');
  res.redirect('/auth/login');
}

// ── GET /wishlist ─────────────────────────────────────────────
router.get('/', requireLogin, async (req, res) => {
  try {
    const [items] = await db.query(
      `SELECT p.*, wl.id AS wishlist_id
       FROM Wishlist wl JOIN Products p ON wl.product_id = p.id
       WHERE wl.user_id = ?
       ORDER BY wl.created_at DESC`,
      [req.session.user.id]
    );
    res.render('wishlist', { title: 'My Wishlist | NEON TECH', items });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

// ── POST /wishlist/toggle – Add or Remove ─────────────────────
router.post('/toggle', requireLogin, async (req, res) => {
  const product_id = parseInt(req.body.product_id);
  if (!product_id) return res.redirect('/');

  try {
    const [existing] = await db.query(
      'SELECT id FROM Wishlist WHERE user_id = ? AND product_id = ?',
      [req.session.user.id, product_id]
    );

    if (existing.length) {
      await db.query('DELETE FROM Wishlist WHERE id = ?', [existing[0].id]);
      req.flash('success', 'Removed from wishlist.');
    } else {
      await db.query(
        'INSERT INTO Wishlist (user_id, product_id) VALUES (?, ?)',
        [req.session.user.id, product_id]
      );
      req.flash('success', 'Added to wishlist!');
    }

    const back = req.headers.referer || `/products/${product_id}`;
    res.redirect(back);
  } catch (err) {
    console.error(err);
    res.redirect('/wishlist');
  }
});

module.exports = router;
