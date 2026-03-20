# NEON TECH – Development Walkthrough

## 1. Local Setup Instructions
To run this project on a fresh machine or evaluation environment, follow these steps strictly.

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server (v8+ recommended)
- A registered Stripe account (for Test API keys)
- A Google Account with 2-Step Verification enabled (for Gmail App Passwords)

### Step 1: Clone & Install Dependencies
Open your terminal in the project root and run:
```bash
npm install
```
This installs `express`, `ejs`, `mysql2`, `stripe`, `nodemailer`, `bcryptjs`, and all security middleware natively.

### Step 2: Database Initialization
1. Open your MySQL client (Workbench, CLI, or phpMyAdmin).
2. Execute the schema file first to generate the tables and triggers:
   `source database/schema.sql`
3. Execute the seed file to populate categories, products, and a test admin user:
   `source database/seed.sql`

### Step 3: Environment Variables
Create a file named `.env` in the root folder matching this structure (a `.env` file should never be uploaded to GitHub):
```env
# Server
NODE_ENV=development
APP_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=neon_tech_db

# Security & Sessions
SESSION_SECRET=a_very_long_secure_random_string

# Stripe (Test Mode)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Mailer
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_16_char_app_password
```

### Step 4: Run the Server
```bash
npm run dev
```
The application will boot at `http://localhost:3000`. Navigate there in your browser.

---

## 2. Testing the Application

### 2.1 The Shopping Pipeline
1. Add an item from the main screen securely.
2. If not logged in, the system intentionally rejects cart modifications and routes you to the Login module.
3. Login using the seed data: `admin@neontech.com` / `password123`.

### 2.2 Processing Stripe
1. Enter the Checkout sequence.
2. Click "Pay Securely" to interact with the Stripe API.
3. Input `4242 4242 4242 4242` on the dummy card portal.
4. Verify the redirection dumps you gracefully onto `/checkout/success`.

### 2.3 Validating the Order
1. Check your email inbox specified in the registration to visually confirm the HTML receipt.
2. In the user Navbar, click "Orders" to physically verify the persisted relational logic inside the MySQL mapping algorithm.
