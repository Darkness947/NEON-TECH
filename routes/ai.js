// ============================================================
// routes/ai.js – AI Features (Explain & Compare) via Gemini
// ============================================================
'use strict';

const express       = require('express');
const router        = express.Router();
const db            = require('../config/db');
const { askGemini } = require('../config/gemini');

// ── POST /ai/explain – AI Product Explanation ─────────────────
router.post('/explain', async (req, res) => {
  try {
    const productId = parseInt(req.body.product_id);
    if (!productId) {
      return res.status(400).json({ error: 'Invalid product ID.' });
    }

    // Fetch product from DB
    const [[product]] = await db.query(
      'SELECT name_en, desc_en, price, category FROM Products WHERE id = ?',
      [productId]
    );
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const prompt = `You are a friendly and knowledgeable electronics shopping assistant for NEON TECH, a premium electronics store.

A customer wants to understand this product better:

Product Name: ${product.name_en}
Category: ${product.category}
Price: $${Number(product.price).toFixed(2)}
Description: ${product.desc_en}

Please provide a clear, concise explanation with these sections:
1. **What It Is** — A simple, jargon-free summary of what the product is.
2. **Key Benefits** — 3-4 bullet points highlighting the main advantages.
3. **Who Should Buy It** — Describe the ideal customer for this product.

Keep the tone professional but approachable. Use no more than 200 words total. Use markdown formatting for readability.`;

    const aiText = await askGemini(prompt);
    return res.json({ success: true, explanation: aiText });

  } catch (err) {
    console.error('[AI Explain Error]', err.message);
    return res.status(500).json({
      error: 'AI service is temporarily unavailable. Please try again shortly.'
    });
  }
});

// ── POST /ai/compare – AI Product Comparison ──────────────────
router.post('/compare', async (req, res) => {
  try {
    const id1 = parseInt(req.body.product_id_1);
    const id2 = parseInt(req.body.product_id_2);

    if (!id1 || !id2 || id1 === id2) {
      return res.status(400).json({ error: 'Please select two different products.' });
    }

    // Fetch both products
    const [[p1]] = await db.query(
      'SELECT id, name_en, desc_en, price, category FROM Products WHERE id = ?',
      [id1]
    );
    const [[p2]] = await db.query(
      'SELECT id, name_en, desc_en, price, category FROM Products WHERE id = ?',
      [id2]
    );

    if (!p1 || !p2) {
      return res.status(404).json({ error: 'One or both products not found.' });
    }

    const prompt = `You are a product comparison expert for NEON TECH, a premium electronics store.

Compare these two products for a customer trying to decide which to buy:

**Product 1: ${p1.name_en}**
- Category: ${p1.category}
- Price: $${Number(p1.price).toFixed(2)}
- Description: ${p1.desc_en}

**Product 2: ${p2.name_en}**
- Category: ${p2.category}
- Price: $${Number(p2.price).toFixed(2)}
- Description: ${p2.desc_en}

Please provide:
1. **Key Differences** — The most important differences between these products.
2. **Pros & Cons** — List pros and cons for each product.
3. **Recommendation** — Which product is better and why, considering value for money.

Keep the tone professional and helpful. Use markdown formatting. Limit the response to about 300 words.`;

    const aiText = await askGemini(prompt);
    return res.json({
      success: true,
      comparison: aiText,
      product1: { id: p1.id, name: p1.name_en, price: p1.price, category: p1.category },
      product2: { id: p2.id, name: p2.name_en, price: p2.price, category: p2.category }
    });

  } catch (err) {
    console.error('[AI Compare Error]', err.message);
    return res.status(500).json({
      error: 'AI service is temporarily unavailable. Please try again shortly.'
    });
  }
});

module.exports = router;
