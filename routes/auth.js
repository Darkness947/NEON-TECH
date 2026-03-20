// ============================================================
// routes/auth.js – Register / Login / Logout
// ============================================================
'use strict';

const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const validator = require('validator');
const db        = require('../config/db');

// ── GET /auth/register ────────────────────────────────────────
router.get('/register', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/register', { title: 'Register | NEON TECH' });
});

// ── POST /auth/register ───────────────────────────────────────
router.post('/register', async (req, res) => {
  if (req.session.user) return res.redirect('/');

  const { name, email, password, confirm_password } = req.body;
  const errors = [];

  // ── Validation ──
  if (!name   || validator.isEmpty(name.trim()))
    errors.push('Name is required.');
  if (!email  || !validator.isEmail(email))
    errors.push('Valid email is required.');
  if (!password || password.length < 8)
    errors.push('Password must be at least 8 characters.');
  if (password !== confirm_password)
    errors.push('Passwords do not match.');

  if (errors.length) {
    req.flash('error', errors);
    return res.redirect('/auth/register');
  }

  try {
    // Check duplicate email (parameterized – SQL injection prevention)
    const [existing] = await db.query('SELECT id FROM Users WHERE email = ?', [
      validator.normalizeEmail(email)
    ]);
    if (existing.length) {
      req.flash('error', 'Email already registered.');
      return res.redirect('/auth/register');
    }

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [validator.escape(name.trim()), validator.normalizeEmail(email), hash, 'customer']
    );

    req.flash('success', 'Account created! You can now log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error. Please try again.');
    res.redirect('/auth/register');
  }
});

// ── GET /auth/login ───────────────────────────────────────────
router.get('/login', (req, res) => {
  if (req.session.user) return res.redirect('/');
  res.render('auth/login', { title: 'Login | NEON TECH' });
});

// ── POST /auth/login ──────────────────────────────────────────
router.post('/login', async (req, res) => {
  if (req.session.user) return res.redirect('/');

  const { email, password } = req.body;

  if (!email || !validator.isEmail(email) || !password) {
    req.flash('error', 'Invalid credentials.');
    return res.redirect('/auth/login');
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM Users WHERE email = ?',
      [validator.normalizeEmail(email)]
    );

    if (!rows.length) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }

    // Regenerate session to prevent session fixation
    req.session.regenerate((err) => {
      if (err) {
        req.flash('error', 'Server error. Please try again.');
        return res.redirect('/auth/login');
      }
      req.session.user = {
        id:   user.id,
        name: user.name,
        email:user.email,
        role: user.role,
        lang: user.lang
      };
      req.session.lang = user.lang;
      req.flash('success', `Welcome back, ${user.name}!`);
      res.redirect('/');
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Server error. Please try again.');
    res.redirect('/auth/login');
  }
});

// ── GET /auth/logout ──────────────────────────────────────────
router.get('/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

module.exports = router;
