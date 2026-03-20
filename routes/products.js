// ============================================================
// routes/products.js – Product Detail Page
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── GET /products/:id ─────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  if (!id) return res.redirect('/');

  try {
    const [[product]] = await db.query('SELECT * FROM Products WHERE id = ?', [id]);
    if (!product) return res.status(404).render('error', { title: '404', code: 404, message: 'Product not found.' });

    // Related products (same category, excluding this one)
    const [related] = await db.query(
      'SELECT * FROM Products WHERE category = ? AND id != ? LIMIT 4',
      [product.category, id]
    );

    // Reviews with user name
    const [reviews] = await db.query(
      `SELECT r.*, u.name AS user_name
       FROM Reviews r
       JOIN Users u ON r.user_id = u.id
       WHERE r.product_id = ?
       ORDER BY r.created_at DESC`,
      [id]
    );

    // Check if in wishlist (if logged in)
    let inWishlist = false;
    if (req.session.user) {
      const [wl] = await db.query(
        'SELECT id FROM Wishlist WHERE user_id = ? AND product_id = ?',
        [req.session.user.id, id]
      );
      inWishlist = wl.length > 0;
    }

    const lang = req.session.lang || 'en';
    res.render('product', {
      title: (lang === 'ar' ? product.name_ar : product.name_en) + ' | NEON TECH',
      product,
      related,
      reviews,
      inWishlist
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

module.exports = router;
