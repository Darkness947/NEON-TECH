// ============================================================
// app.js – NEON TECH Express Application
// ============================================================
'use strict';

const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const helmet       = require('helmet');
const flash        = require('connect-flash');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();

// ── Security Headers ─────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc:   ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://fonts.googleapis.com"],
      fontSrc:    ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      scriptSrc:  ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://js.stripe.com"],
      frameSrc:   ["https://js.stripe.com", "https://hooks.stripe.com"],
      imgSrc:     ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      formAction: ["'self'", "https://checkout.stripe.com"],
      upgradeInsecureRequests: null
    }
  }
}));

// ── View Engine ───────────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// ── Static Files ──────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));
// Serve product images from the images folder
app.use('/images', express.static(path.join(__dirname, 'images')));

// ── Body Parsers ──────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// ── Session ───────────────────────────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'neontech_secret',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    secure:   process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge:   1000 * 60 * 60 * 24  // 24 hours
  }
}));

// ── Flash Messages ────────────────────────────────────────────
app.use(flash());

// ── Global Template Variables ─────────────────────────────────
app.use((req, res, next) => {
  res.locals.user          = req.session.user || null;
  res.locals.success_msg   = req.flash('success');
  res.locals.error_msg     = req.flash('error');
  res.locals.lang          = req.session.lang || 'en';
  res.locals.cartCount     = req.session.cartCount || 0;
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/',          require('./routes/index'));
app.use('/auth',      require('./routes/auth'));
app.use('/products',  require('./routes/products'));
app.use('/cart',      require('./routes/cart'));
app.use('/checkout',  require('./routes/checkout'));
app.use('/orders',    require('./routes/orders'));
app.use('/wishlist',  require('./routes/wishlist'));
app.use('/reviews',   require('./routes/reviews'));

// ── 404 Handler ───────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('error', {
    title:   'Page Not Found',
    code:    404,
    message: 'The page you are looking for does not exist.'
  });
});

// ── Global Error Handler ──────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', {
    title:   'Server Error',
    code:    500,
    message: 'Something went wrong. Please try again later.'
  });
});

module.exports = app;
