// ============================================================
// config/mailer.js – Nodemailer + Gmail Order Confirmation
// ============================================================
'use strict';

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

/**
 * Send order confirmation email
 * @param {Object} user   - { name, email }
 * @param {number} orderId
 * @param {Array}  items  - [{ name_en, quantity, price }]
 * @param {number} total
 */
async function sendOrderConfirmation(user, orderId, items, total) {
  const itemRows = items.map(i => `
    <tr>
      <td style="padding:8px 12px;border-bottom:1px solid #1a1a4e;">${i.name_en}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1a1a4e;text-align:center;">${i.quantity}</td>
      <td style="padding:8px 12px;border-bottom:1px solid #1a1a4e;text-align:right;">$${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><title>Order Confirmed – NEON TECH</title></head>
    <body style="margin:0;background:#0a0a1a;font-family:'Segoe UI',Arial,sans-serif;color:#e0e0ff;">
      <table width="600" cellpadding="0" cellspacing="0" align="center"
             style="background:#12122a;border:1px solid #00f5ff;border-radius:12px;margin:30px auto;overflow:hidden;">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#0a0a1a,#1a0040);padding:30px;text-align:center;">
            <h1 style="color:#00f5ff;font-size:28px;margin:0;letter-spacing:3px;
                        text-shadow:0 0 15px #00f5ff;">⚡ NEON TECH</h1>
            <p style="color:#bf00ff;margin:6px 0 0;font-size:14px;letter-spacing:2px;">ORDER CONFIRMED</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:30px;">
            <p>Hi <strong style="color:#00f5ff;">${user.name}</strong>,</p>
            <p>Your order <strong style="color:#bf00ff;">#${orderId}</strong> has been placed successfully. Thank you for shopping with NEON TECH!</p>
            <!-- Items Table -->
            <table width="100%" cellpadding="0" cellspacing="0"
                   style="border:1px solid #00f5ff;border-radius:8px;overflow:hidden;margin:20px 0;">
              <thead>
                <tr style="background:#0d0d2e;">
                  <th style="padding:10px 12px;text-align:left;color:#00f5ff;font-size:12px;text-transform:uppercase;">Product</th>
                  <th style="padding:10px 12px;text-align:center;color:#00f5ff;font-size:12px;text-transform:uppercase;">Qty</th>
                  <th style="padding:10px 12px;text-align:right;color:#00f5ff;font-size:12px;text-transform:uppercase;">Price</th>
                </tr>
              </thead>
              <tbody>${itemRows}</tbody>
              <tfoot>
                <tr style="background:#0d0d2e;">
                  <td colspan="2" style="padding:12px;font-weight:bold;color:#e0e0ff;">Total</td>
                  <td style="padding:12px;text-align:right;font-weight:bold;color:#00f5ff;font-size:18px;">$${Number(total).toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
            <p style="color:#888;font-size:13px;">If you have any questions, reply to this email or contact us at support@neontech.com</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#0a0a1a;padding:20px;text-align:center;">
            <p style="color:#555;font-size:12px;margin:0;">© ${new Date().getFullYear()} NEON TECH. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>`;

  await transporter.sendMail({
    from:    `"NEON TECH" <${process.env.GMAIL_USER}>`,
    to:      user.email,
    subject: `✅ Order #${orderId} Confirmed – NEON TECH`,
    html
  });
}

module.exports = { sendOrderConfirmation };
