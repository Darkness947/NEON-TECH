# ⚡ NEON TECH: Comprehensive Local Deployment Guide

Welcome to the **NEON TECH** deployment guide. This document provides a step-by-step, deep-dive walkthrough for setting up and running the NEON TECH e-commerce platform on your local development machine.

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

1.  **Node.js (v18.x or higher):** [Download here](https://nodejs.org/)
2.  **MySQL Server (v8.0 or higher):** [Download here](https://dev.mysql.com/downloads/installer/)
3.  **Git:** [Download here](https://git-scm.com/)
4.  **A Code Editor:** We recommend [VS Code](https://code.visualstudio.com/).

---

## 🛠️ Step 1: Clone the Repository

Open your terminal or command prompt and run:

```bash
git clone https://github.com/Darkness947/NEON-TECH.git
cd NEON-TECH
```

---

## 📦 Step 2: Install Dependencies

Install all required Node.js packages using npm:

```bash
npm install
```

---

## 🗄️ Step 3: Database Setup

NEON TECH uses a MySQL database. You need to create the database schema and populate it with initial data.

### Method A: Using MySQL Command Line
1.  Log into MySQL:
    ```bash
    mysql -u root -p
    ```
2.  Execute the schema and seed scripts:
    ```sql
    SOURCE database/schema.sql;
    SOURCE database/seed.sql;
    ```

### Method B: Using MySQL Workbench
1.  Open MySQL Workbench and connect to your local instance.
2.  Open `database/schema.sql`, copy its contents into a new Query Tab, and execute it (lightning bolt icon).
3.  Open `database/seed.sql`, copy its contents into a new Query Tab, and execute it.

> [!NOTE]
> The `seed.sql` script creates a default admin user:
> - **Email:** `admin@neontech.com`
> - **Password:** `password123`

---

## ⚙️ Step 4: Environment Configuration (`.env`)

In the root directory of the project, create a file named `.env`. Copy the template below and fill in your specific details.

```env
# Server
PORT=3000
NODE_ENV=development

# Database (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=neon_tech_db

# Session Secret (A random string for session security)
SESSION_SECRET=NeonTech@SuperSecretKey#2026!

# Stripe (Test Keys)
# Get these from: https://dashboard.stripe.com/test/apikeys
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Gmail / Nodemailer
# 1. Use your Gmail address.
# 2. Get a 16-character App Password from Google:
#    https://myaccount.google.com/apppasswords
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_google_app_password

# App URL (Used for redirects and emails)
APP_URL=http://localhost:3000

# Google Gemini AI
# Get your API key from: https://aistudio.google.com/apikey
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🔐 Step 5: Password Security (One-time Setup)

Since the `seed.sql` file contains plain-text passwords for demonstration, we need to hash them to ensure the login system works with the `bcryptjs` security layer.

Run the following command once:

```bash
npm run seed
```

This script (`database/hash_passwords.js`) will scan your database and convert any plain-text passwords into secure hashes.

---

## 🚀 Step 6: Launch the Application

You are now ready to start the server!

### For Development (with Auto-Reload):
```bash
npm run dev
```

### For Standard Launch:
```bash
npm start
```

The application will be live at: **[http://localhost:3000](http://localhost:3000)**

---

## 🧪 Step 7: Testing Key Features

Once the app is running, try the following to ensure everything is set up correctly:

1.  **Login:** Go to the login page and use `admin@neontech.com` with `password123`.
2.  **AI Explain:** Open any product page and click the **"Explain this product"** button. This tests your Gemini API connection.
3.  **Checkout:** Add an item to your cart and proceed to checkout. This tests your Stripe integration. (Use card number `4242 4242 4242 4242` for testing).
4.  **Language Toggle:** Switch between English and Arabic at the top right to test the RTL/Bilingual support.

---

## ❓ Troubleshooting

*   **MySQL Connection Error:** Ensure your `DB_USER` and `DB_PASSWORD` in the `.env` file match your local MySQL credentials.
*   **Stripe Errors:** Ensure you are using "Test Mode" keys and not "Live" keys.
*   **Email Not Sending:** Verify that you are using a **Google App Password**, not your regular Gmail password.
*   **Gemini AI Errors:** Ensure your `GEMINI_API_KEY` is valid and has not reached its quota limits.

---

<div align="center">
  <i>Need help? Contact the NEON TECH development team or check the <code>documentation/</code> folder for more technical details.</i>
</div>
