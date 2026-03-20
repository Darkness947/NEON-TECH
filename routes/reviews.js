// ============================================================
// routes/reviews.js – Product Reviews & Ratings
// ============================================================
'use strict';

const express   = require('express');
const router    = express.Router();
const validator = require('validator');
const db        = require('../config/db');

function requireLogin(req, res, next) {
  if (req.session.user) return next();
  req.flash('error', 'Please log in to submit a review.');
  res.redirect('/auth/login');
}

// ── POST /reviews – Submit Review ────────────────────────────
router.post('/', requireLogin, async (req, res) => {
  const product_id = parseInt(req.body.product_id);
  const rating     = parseInt(req.body.rating);
  const comment    = req.body.comment ? validator.escape(req.body.comment.trim()) : '';

  if (!product_id || rating < 1 || rating > 5) {
    req.flash('error', 'Invalid review data.');
    return res.redirect(`/products/${product_id || ''}`);
  }

  try {
    await db.query(
      `INSERT INTO Reviews (user_id, product_id, rating, comment)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = VALUES(rating), comment = VALUES(comment)`,
      [req.session.user.id, product_id, rating, comment]
    );
    req.flash('success', 'Review submitted!');
    res.redirect(`/products/${product_id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not submit review.');
    res.redirect(`/products/${product_id}`);
  }
});

// ── POST /reviews/delete – Delete Own Review ─────────────────
router.post('/delete', requireLogin, async (req, res) => {
  const review_id  = parseInt(req.body.review_id);
  const product_id = parseInt(req.body.product_id);

  try {
    await db.query(
      'DELETE FROM Reviews WHERE id = ? AND user_id = ?',
      [review_id, req.session.user.id]
    );
    req.flash('success', 'Review deleted.');
    res.redirect(`/products/${product_id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/products/${product_id}`);
  }
});

module.exports = router;
