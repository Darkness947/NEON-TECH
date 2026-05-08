<div align="center">
  <img src="images/NEON%20TECH%20LOGO.png" alt="NEON TECH Logo" width="350" />

  # ⚡ NEON TECH E-Commerce Platform
  
  **A Premium, AI-Powered Electronics Storefront built for the Future.**
  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
  ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
  ![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
  ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
  ![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)
</div>

<br />

## 📖 Overview
**NEON TECH** is a university-grade full-stack web application designed to simulate a modern electronics storefront. It features a stunning Cyberpunk neon aesthetic, fully functional session-based authentication, an active shopping cart system, integration with the Stripe Payment Gateway, and **AI-powered intelligence via Google Gemini**.

### 🏛️ Architectural Constraints
This project adheres to a strict architectural rule: **No MVC Controllers**.
To maximize control-flow transparency, all backend logic—including checkout pipelines, database UPSERTs, AI integrations, and sequential payment validations—is engineered **directly inline** within isolated Express Router endpoints (e.g., `routes/checkout.js`, `routes/ai.js`).

---

## ✨ Core Features
- **🌍 Bilingual & RTL Support:** Toggle instantly between English and Arabic (`عربي`). The UI automatically flips layout directions using custom CSS bindings and Session mapping.
- **🔐 Secure Authentication:** Implements `bcryptjs` password hashing and `express-session` fixation defense.
- **🛒 Persistent Carts & Wishlists:** Carts are bound synchronously to the MySQL Database (not stateless arrays), ensuring shopping progress is never lost on logout.
- **💳 Stripe Payment Engine:** Fully wired to Stripe Checkout Sessions (Test Mode) using official Node integrations, preventing user cart manipulation.
- **📧 Nodemailer Receipts:** Asynchronously dispatches elegantly coded HTML receipt emails to customers upon confirmed Stripe Payments via Gmail SMTP.
- **⭐ Intelligent Database Triggers:** Rating aggregations run inherently on the MySQL engine utilizing `AFTER INSERT` triggers, alleviating the NodeJS thread from heavy lifting.

---

## 🤖 AI-Powered Features (Google Gemini)

NEON TECH integrates Google's **Gemini Generative AI** to bring intelligent, real-time assistance directly into the shopping experience. The integration includes a **resilient multi-model fallback system** that automatically rotates through 5 Gemini models with exponential backoff retries if any model becomes overloaded or quota-exhausted.

### Feature 1 — AI Product Explanation
> **Route:** `POST /ai/explain` &nbsp; | &nbsp; **Page:** Product Detail

A single click on the **"🤖 Explain this product"** button sends the product's name, description, and price to Gemini. The AI returns a user-friendly breakdown including:
- **What It Is** — A simple, jargon-free summary.
- **Key Benefits** — The top advantages as bullet points.
- **Who Should Buy It** — The ideal customer profile.

The response is rendered in a scrollable, neon-themed panel directly below the button on the product detail page.

### Feature 2 — AI Product Comparison
> **Route:** `POST /ai/compare` &nbsp; | &nbsp; **Page:** Homepage

Shoppers can check the comparison checkbox on any **two product cards** on the homepage. A floating **Compare Bar** slides up from the bottom showing the selected products. Clicking **"Compare Now"** opens a full-screen modal with:
- **Side-by-side product header cards** showing names, categories, and prices.
- **AI-generated comparison** including key differences, pros & cons, and a final recommendation.

The comparison result is displayed in a scrollable panel inside the modal.

📘 **Full documentation for each AI feature:**
- [AI Product Explanation Documentation](documentation/ai-product-explanation.md)
- [AI Product Comparison Documentation](documentation/ai-product-comparison.md)

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- A **Stripe Account** (for Test API Keys)
- A **Gmail Account** (with an App Password enabled)
- A **Google AI Studio Account** (for the Gemini API Key)

### 1. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/your-username/neon-tech.git
cd "Neon Tech"
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory (this file is gitignored for security) and add your keys:
```env
# Server
NODE_ENV=development
APP_URL=http://localhost:3000

# Database (Ensure this matches your MySQL credentials)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=neon_tech_db

# Security & Sessions
SESSION_SECRET=your_secure_random_string

# Stripe API (Use the "Test Mode" keys from your Stripe Dashboard)
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Mailer (Use a 16-character Google App Password, NOT your normal password)
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password

# Gemini AI (Get your key from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Database Initialization
Open your MySQL CLI or Workspace and execute the generation scripts:
```sql
source path/to/project/database/schema.sql
source path/to/project/database/seed.sql
```
*(The seed script automatically populates all 12 products and assigns an admin test user: `admin@neontech.com` / `password123`).*

### 4. Run the Platform
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to browse the store!

---

## 📚 Project Documentation

For deeper details regarding the backend architecture, AI integration, and UML graphs, explore the folders below:

- **[🖥️ Development Walkthrough](documentation/walkthrough.md)**: A step-by-step guide for evaluators on how to browse the source and test the Stripe integration.
- **[📋 System Requirements (SRS)](documentation/requirements.md)**: The strict bounds of the user stories and non-functional security goals.
- **[📑 Final Documentation](documentation/final-documentation.md)**: A high-level overview of the security topologies, database triggers, and inline-routing philosophies.
- **[🤖 AI Product Explanation](documentation/ai-product-explanation.md)**: Comprehensive documentation of the AI Explanation feature.
- **[🤖 AI Product Comparison](documentation/ai-product-comparison.md)**: Comprehensive documentation of the AI Comparison feature.
- **[📊 System Diagrams](diagrams/)**: Contains Markdown files compatible with GitHub's native Mermaid viewer portraying the Architecture, ERD, Sequence, and Flow schemas.

---

## 🗂️ Project Structure
```
Neon Tech/
├── config/          # Database, Mailer, and Gemini AI configurations
├── database/        # SQL schema and seed data
├── diagrams/        # Mermaid architecture/ERD/sequence/flow diagrams
├── documentation/   # Walkthrough, SRS, final docs, AI feature docs
├── images/          # Product images and project logo
├── public/          # Static CSS, JS, and assets
├── routes/          # Express routers (index, auth, products, cart,
│                    #   checkout, orders, wishlist, reviews, ai)
├── views/           # EJS templates, layouts, and partials
├── app.js           # Express application configuration
├── server.js        # Server entry point
├── .env             # Environment variables (gitignored)
└── package.json     # Dependencies and scripts
```

---
<div align="center">
  <i>Simulated and architected for educational excellence — Spring 2026.</i>
</div>
