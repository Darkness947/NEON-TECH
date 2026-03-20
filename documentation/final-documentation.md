# NEON TECH – Final Project Documentation

## 1. Executive Summary
**NEON TECH** is a fully functional, university-grade E-Commerce environment designed from the ground up focusing heavily on strict routing architecture and cybersecurity paradigms. It successfully simulates a high-end electronics storefront featuring customized EJS layouts natively injected with Content Security Policies, robust raw SQL data querying, and live third-party financial API simulation via Stripe.

---

## 2. Structural Architecture

### The "No-Controller" Route Philosophy
A critical constraint of this build was maintaining maximum transparency of business logic. Standard Model-View-Controller (MVC) abstractions were disallowed. 
Instead, all operational logic sits directly mapped inside Express Router instances:
- `routes/checkout.js`: Houses the complete session generation, stock subtraction triggers, active MySQL cart deletion, and Nodemailer invocation sequentially.
- `routes/auth.js`: Implements password hashing and session hijacking defense directly alongside the POST requests.

### Database Intelligence (Raw SQL)
We avoided ORMs like Sequelize or Prisma to prove strict SQL proficiency. 
- **MySQL2 Promises:** Allows native JavaScript `async/await` syntax resolving callback hell.
- **Triggers:** The database natively recalculates product aggregate ratings intelligently on the background layer (`schema.sql: trigger update_product_rating(...)`), preventing application bottlenecking when querying large catalog grids.

---

## 3. Implemented Requirements Checklist

### Frontend UI/UX
- [x] Responsive layout utilizing modern CSS variables (`var(--neon-green)`).
- [x] Native RTL translation via Session injection (`lang === 'ar'`).
- [x] Flash alerting system utilizing connected toasts.

### Security Implementation
- [x] `helmet`: Bypassed local HTTP restriction mapping for Stripe whilst fully isolating generic XSS attacks.
- [x] `bcryptjs`: Encrypted generic string literals passing through memory natively.
- [x] `express-session`: Enforced Session-Id resetting preventing generic token fixation.

### Feature Deliveries
- [x] Live Product Filtering
- [x] User-Bound Shopping Carts (Persisting Logouts)
- [x] Active Stripe Testing Checkouts
- [x] Wishlists & Rating Interfaces
- [x] Asynchronous Gmail Nodemailer receipts

---

## 4. Codebase Mapping
```text
/
├── config/              # Shared integrations (db.js, mailer.js)
├── database/            # Raw .sql scripts for instantiation
├── diagrams/            # Architecture graphs (Mermaid syntax)
├── documentation/       # Setup manuals & final requirement documents
├── public/              # Static served assets (css, js, images)
├── reports/             # Phase-by-phase development logs
├── routes/              # All isolated functional endpoints
└── views/               # EJS template partials and pages
```
