// ============================================================
// routes/index.js – Homepage & Product Listing
// ============================================================
'use strict';

const express = require('express');
const router  = express.Router();
const db      = require('../config/db');

// ── Helper: build cart count for session ─────────────────────
async function updateCartCount(req) {
  if (req.session.user) {
    const [rows] = await db.query(
      'SELECT COALESCE(SUM(quantity),0) AS cnt FROM ShopCart WHERE user_id = ?',
      [req.session.user.id]
    );
    req.session.cartCount = Number(rows[0].cnt);
  }
}

// ── GET / – Homepage ─────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const search   = req.query.search   || '';
    const category = req.query.category || '';

    let sql    = 'SELECT * FROM Products WHERE 1=1';
    const params = [];

    if (search) {
      sql += ' AND (name_en LIKE ? OR name_ar LIKE ? OR desc_en LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }
    sql += ' ORDER BY created_at DESC';

    const [products] = await db.query(sql, params);
    const [cats]     = await db.query('SELECT DISTINCT category FROM Products ORDER BY category');

    await updateCartCount(req);

    res.render('index', {
      title:      'Home | NEON TECH',
      products,
      categories: cats.map(c => c.category),
      search,
      selectedCategory: category
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('error', { title: 'Error', code: 500, message: err.message });
  }
});

// ── GET /lang/:locale – Language Toggle ───────────────────────
router.get('/lang/:locale', (req, res) => {
  const locale = req.params.locale;
  if (['en', 'ar'].includes(locale)) {
    req.session.lang = locale;
  }
  const back = req.headers.referer || '/';
  res.redirect(back);
});

module.exports = router;
