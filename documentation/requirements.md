# NEON TECH – Software Requirements Specification (SRS)

## 1. Introduction
The NEON TECH E-Commerce platform is a university-level web application designed to simulate a modern, premium electronics storefront. It features a bilingual interface (English/Arabic), RTL layout support, robust session-based authentication, and a full shopping cart pipeline culminating in Stripe payment integration and Nodemailer email receipts.

---

## 2. Functional Requirements

### 2.1 User Management
- **FR1:** Visitors can register an account securely (passwords hashed via `bcryptjs`).
- **FR2:** Users must authenticate using their email and password.
- **FR3:** Authenticated users enjoy persistent cart and wishlist states via session binding.

### 2.2 Product Discovery
- **FR4:** The homepage shall load a dynamic grid of active products.
- **FR5:** Users can filter the grid strictly by the standard categories (e.g., Gaming, Audio).
- **FR6:** A universal search bar allows substring lookups on both English and Arabic product names/descriptions.
- **FR7:** Each product page displays stock indicators (In Stock, Low Stock, out of stock) preventing over-purchasing.

### 2.3 E-Commerce Operations
- **FR8:** Users can place items into their Cart. If an item exists, `quantity` is incremented.
- **FR9:** Users must be logged in to access the Checkout state. Guests are gracefully redirected to the authentication wall.
- **FR10:** Checkout dynamically generates a Stripe Checkout Session using the exact `ShopCart` database state, blocking monetary spoofing.
- **FR11:** Upon successful payment validation, the system shall decrement product stock, empty the cart, migrate items to the `OrderItems` ledger, and dispatch a simulated Nodemailer email receipt.

### 2.4 User Experience (UX) Features
- **FR12:** The platform supports an active Language Toggle persisting in the session, flipping the UI into appropriate RTL syntax dynamically.
- **FR13:** Users can maintain a separate Wishlist for products without adding them to the cart layer.
- **FR14:** Past purchases are tracked and logged inside a detailed "Order History" interface per user constraint.
- **FR15:** Users can attach a single text review and a 1-5 star rating to any product. A database trigger automatically averages the rating aggregate on the `Products` table.

---

## 3. Non-Functional Requirements

### 3.1 Security (Strict Compliance)
- **NFR1:** The server must enforce Content Security Policies (CSP) using the `helmet` library.
- **NFR2:** Input sanitization is aggressively applied utilizing the `validator` library targeting emails and SQL Injection vectors.
- **NFR3:** Session Fixation defense forces a complete token regeneration via `express-session` during the login transition.
- **NFR4:** Raw SQL `mysql2` execution explicitly utilizes parameterized bound queries (`[arg1, arg2]`) natively securing against injection.

### 3.2 Architectural Pattern
- **NFR5:** As specifically required, standard MVC controller abstractions are omitted. Instead, logic rests localized directly inline inside modular router files (`routes/` endpoints) ensuring complete traceability.

---

## 4. Environment Map Requirements

Required contents of the `.env` execution file to fulfill system operations:
- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` (MySQL Connectivity)
- `SESSION_SECRET` (Cryptographic signing for express-session)
- `STRIPE_SECRET_KEY` (Test payments)
- `GMAIL_USER`, `GMAIL_PASS` (App Password for receipt delivery)
