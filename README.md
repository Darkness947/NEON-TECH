<div align="center">
  <img src="images/NEON%20TECH%20LOGO.png" alt="NEON TECH Logo" width="350" />

  # ⚡ NEON TECH E-Commerce Platform
  
  **A Premium, High-Performance Electronics Storefront built for the Future.**
  
  ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
  ![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
  ![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
  ![Bootstrap](https://img.shields.io/badge/Bootstrap_5-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
  ![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=Stripe&logoColor=white)
</div>

<br />

## 📖 Overview
**NEON TECH** is a university-grade full-stack web application designed to simulate a modern electronics storefront. It features a stunning Cyberpunk neon aesthetic, fully functional session-based authentication, an active shopping cart system, and an integration with the Stripe Payment Gateway.

### 🏛️ Architectural Constraints
This project adheres to a strict architectural rule: **No MVC Controllers**.
To maximize control-flow transparency, all backend logic—including checkout pipelines, database UPSERTs, and sequential payment validations—is engineered **directly inline** within isolated Express Router endpoints (e.g., `routes/checkout.js`).

---

## ✨ Core Features
- **🌍 Bilingual & RTL Support:** Toggle instantly between English and Arabic (`عربي`). The UI automatically flips layout directions using custom CSS bindings and Session mapping.
- **🔐 Secure Authentication:** Implements `bcryptjs` password hashing and `express-session` fixation defense.
- **🛒 Persistent Carts & Wishlists:** Carts are bound synchronously to the MySQL Database (not stateless arrays), ensuring shopping progress is never lost on logout.
- **💳 Stripe Payment Engine:** Fully wired to Stripe Checkout Sessions (Test Mode) using official Node integrations, preventing user cart manipulation.
- **📧 Nodemailer Receipts:** Asynchronously dispatches elegantly coded HTML receipt emails to customers upon confirmed Stripe Payments via Gmail SMTP.
- **⭐ Intelligent Database Triggers:** Rating aggregations run inherently on the MySQL engine utilizing `AFTER INSERT` triggers, alleviating the NodeJS thread from heavy lifting.

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- A **Stripe Account** (for Test API Keys)
- A **Gmail Account** (with an App Password enabled)

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

For deeper details regarding the backend architecture and to review the required UML graphs, explore the folders below:

- **[🖥️ Development Walkthrough](documentation/walkthrough.md)**: A step-by-step guide for evaluators on how to browse the source and test the Stripe integration.
- **[📋 System Requirements (SRS)](documentation/requirements.md)**: The strict bounds of the user stories and non-functional security goals.
- **[📑 Final Documentation](documentation/final-documentation.md)**: A high-level overview of the security topologies, database triggers, and inline-routing philosophies.
- **[📊 System Diagrams](diagrams/)**: Contains Markdown files compatible with GitHub's native Mermaid viewer portraying the Architecture, ERD, Sequence, and Flow schemas.

---
<div align="center">
  <i>Simulated and architected for educational excellence.</i>
</div>
