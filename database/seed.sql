-- ============================================================
-- NEON TECH – Seed Data
-- Run AFTER schema.sql
-- ============================================================

USE neon_tech_db;

-- ── Users (passwords are bcrypt hashes of shown plaintext) ───
-- admin@neontech.com  / Admin@123
-- alice@example.com   / User@1234
-- bob@example.com     / User@1234
-- sara@example.com    / User@1234
INSERT INTO Users (name, email, password_hash, role, lang) VALUES
('Admin Neon',  'admin@neontech.com', '$2b$12$K8D4X3UaZ7fQeKw1L2vBhuuZBcS3j8xN9d4RkOqJghOPvfYtEmmZO', 'admin',    'en'),
('Alice Johnson','alice@example.com',  '$2b$12$K8D4X3UaZ7fQeKw1L2vBhuM5iFakehashAlicexxxxxxxxxxxxxxxxx', 'customer', 'en'),
('Bob Smith',   'bob@example.com',    '$2b$12$K8D4X3UaZ7fQeKw1L2vBhuM5iFakehashBobxxxxxxxxxxxxxxxxx',   'customer', 'en'),
('Sara Ahmed',  'sara@example.com',   '$2b$12$K8D4X3UaZ7fQeKw1L2vBhuM5iFakehashSaraxxxxxxxxxxxxxxxx',  'customer', 'ar');

-- NOTE: Run the Node.js script `database/hash_passwords.js` to regenerate
-- real bcrypt hashes if needed. The hashes above are placeholders for the
-- seed file; use the app's register form or the helper script in practice.

-- ── Products ─────────────────────────────────────────────────
-- Category: Audio & Wearables
INSERT INTO Products (name_en, name_ar, desc_en, desc_ar, category, price, image_path, stock, rating) VALUES
(
  'NeonPods Pro',
  'نيون بودز برو',
  'Premium True Wireless earbuds with Active Noise Cancellation, 30-hour battery life, and crystal-clear audio powered by 10mm dynamic drivers. Water-resistant IPX5 rating with a sleek neon-accented charging case.',
  'سماعات أذن لاسلكية فاخرة مع إلغاء الضوضاء النشط، وعمر بطارية يصل إلى 30 ساعة، وجودة صوت بلورية تعمل بمحركات ديناميكية 10 ملم. مقاومة للماء بتصنيف IPX5 مع علبة شحن أنيقة.',
  'Audio & Wearables',
  199.00,
  '/images/Audio & Wearables/NeonPods Pro (199$).png',
  80,
  4.70
),
(
  'NeonSound Over-Ear',
  'نيون ساوند فوق الأذن',
  'Studio-grade over-ear headphones with 40-hour battery, Hi-Res Audio certification, 3D spatial sound, and foldable design. Features a premium leather headband with neon LED accent stripe for ultimate style.',
  'سماعات استوديو فوق الأذن عالية الجودة بعمر بطارية 40 ساعة، ومعتمدة Hi-Res Audio مع صوت ثلاثي الأبعاد وتصميم قابل للطي. تتميز بشريط لاصق جلدي فاخر مع شريط LED ليزر أنيق.',
  'Audio & Wearables',
  349.00,
  '/images/Audio & Wearables/NeonSound Over-Ear (349$).png',
  45,
  4.80
),
(
  'NeonWatch Series 1',
  'نيون ووتش سيريز 1',
  'Smart fitness watch with AMOLED display, 7-day battery, heart rate & SpO2 monitoring, sleep tracking, 50+ workout modes, and GPS. Crafted from aerospace-grade aluminum with a vibrant neon interface.',
  'ساعة ذكية للياقة البدنية مع شاشة AMOLED وبطارية تدوم 7 أيام، وتتبع معدل ضربات القلب ونسبة الأكسجين والنوم، مع 50+ وضع تمرين ونظام GPS. مصنوعة من الألومنيوم الفضائي بواجهة نيون متوهجة.',
  'Audio & Wearables',
  249.00,
  '/images/Audio & Wearables/NeonWatch Series 1 (249$).png',
  60,
  4.60
),

-- Category: Gaming & Peripherals
(
  'Neon Curved Monitor',
  'شاشة نيون منحنية',
  '32-inch 4K curved gaming monitor with 165Hz refresh rate, 1ms response time, HDR600 support, and AMD FreeSync Premium Pro. Features a stunning neon RGB border with 16.7 million color settings and ultra-wide P3 color gamut.',
  'شاشة ألعاب منحنية 32 بوصة 4K بمعدل تحديث 165Hz وزمن استجابة 1ms ودعم HDR600 و AMD FreeSync Premium Pro. تتميز بحدود RGB نيون مذهلة مع 16.7 مليون لون وجودة ألوان P3 الموسعة.',
  'Gaming & Peripherals',
  699.00,
  '/images/Gaming & Peripherals/Neon Curved Monitor (699$).png',
  30,
  4.90
),
(
  'Neon Edition Mechanical Keyboard',
  'لوحة مفاتيح ميكانيكية نيون',
  'Compact TKL mechanical keyboard featuring Cherry MX switches, per-key RGB backlighting with 20 lighting effects, aluminium frame, and N-key rollover. Includes detachable USB-C cable and magnetic wrist rest.',
  'لوحة مفاتيح ميكانيكية TKL مضغوطة بمفاتيح Cherry MX، وإضاءة RGB لكل مفتاح مع 20 تأثيراً، وإطار ألومنيوم ودعم N-key rollover. تشمل كابل USB-C قابل للفصل ومسند معصم مغناطيسي.',
  'Gaming & Peripherals',
  149.00,
  '/images/Gaming & Peripherals/Neon Edition Mechanical Keyboard (149$).png',
  100,
  4.75
),
(
  'NeonGlide Wireless Mouse',
  'فأرة نيون جلايد اللاسلكية',
  'Precision wireless gaming mouse with 26,000 DPI optical sensor, 6 programmable buttons, 80-hour battery, and ultralight honeycomb shell. Dual-mode connectivity (USB 2.4GHz & Bluetooth 5.0) with customizable RGB.',
  'فأرة ألعاب لاسلكية دقيقة بمستشعر بصري 26,000 DPI و6 أزرار قابلة للبرمجة وبطارية 80 ساعة وهيكل شبكي خفيف الوزن. اتصال مزدوج (USB 2.4GHz و Bluetooth 5.0) مع RGB قابل للتخصيص.',
  'Gaming & Peripherals',
  89.00,
  '/images/Gaming & Peripherals/NeonGlide Wireless Mouse (89$).png',
  150,
  4.65
),

-- Category: Laptops & Computers
(
  'CyberStation Tower',
  'برج سايبر ستيشن',
  'High-performance desktop tower powered by Intel Core i9-14900K, NVIDIA RTX 4090 24GB, 64GB DDR5 RAM, and 4TB NVMe SSD RAID. Features a tempered glass side panel with a full neon RGB lighting system and 1000W 80+ Gold PSU.',
  'برج حاسوب مكتبي عالي الأداء مزود بمعالج Intel Core i9-14900K وكرت شاشة NVIDIA RTX 4090 24GB وذاكرة RAM DDR5 64GB وSSD NVMe 4TB RAID. يتميز بلوح جانبي من الزجاج المقسى مع نظام إضاءة RGB نيون كامل ومزود طاقة 1000W 80+ Gold.',
  'Laptops & Computers',
  2499.00,
  '/images/Laptops & Computers/CyberStation Tower (2499$).png',
  15,
  4.95
),
(
  'NeonBook Air 13',
  'نيون بوك إير 13',
  'Ultralight 13-inch laptop powered by the latest Apple M3 chip equivalent, with a 2K IPS display, 18-hour battery life, 16GB RAM, and 512GB NVMe SSD. A sleek neon-bordered aluminum chassis weighing only 1.1kg.',
  'لابتوب خفيف الوزن 13 بوصة مزود بأحدث معالج مكافئ لـ Apple M3، مع شاشة 2K IPS وعمر بطارية 18 ساعة وذاكرة 16GB وSSD NVMe 512GB. هيكل ألومنيوم أنيق بحدود نيون لا يزيد وزنه عن 1.1 كغ.',
  'Laptops & Computers',
  999.00,
  '/images/Laptops & Computers/NeonBook Air 13 (999$).png',
  40,
  4.55
),
(
  'NeonBook Pro 16',
  'نيون بوك برو 16',
  '16-inch power laptop with Intel Core i7-13700H, NVIDIA RTX 4070 8GB, 32GB DDR5, 1TB NVMe SSD, 4K Mini-LED display, Thunderbolt 4, and 99Wh battery. Built for creators and power users with a premium neon design.',
  'لابتوب قوي 16 بوصة مزود بـ Intel Core i7-13700H وkart شاشة NVIDIA RTX 4070 8GB وذاكرة DDR5 32GB وSSD NVMe 1TB وشاشة Mini-LED 4K وThunderbolt 4 وبطارية 99Wh. مُصمم للمبدعين ومستخدمي الطاقة بتصميم نيون فاخر.',
  'Laptops & Computers',
  1899.00,
  '/images/Laptops & Computers/NeonBook Pro 16 (1899$).png',
  25,
  4.85
),

-- Category: Smartphones & Tablets
(
  'NeonPad Pro',
  'نيون باد برو',
  '11-inch premium tablet with AMOLED 120Hz ProMotion display, Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, quad speakers, and a 10,000mAh battery with 67W fast charging. Comes with stylus support and optional keyboard case.',
  'تابلت فاخر 11 بوصة بشاشة AMOLED 120Hz ProMotion ومعالج Snapdragon 8 Gen 3 وذاكرة 12GB وتخزين 256GB وأربعة مكبرات صوت وبطارية 10,000mAh مع شحن سريع 67W. يأتي مع دعم القلم وحافظة لوحة مفاتيح اختيارية.',
  'Smartphones & Tablets',
  799.00,
  '/images/Smartphones & Tablets/NeonPad Pro (799$).png',
  35,
  4.70
),
(
  'NeonPhone Lite',
  'نيون فون لايت',
  '6.4-inch smartphone with a Super AMOLED FHD+ 90Hz display, Snapdragon 778G, 8GB RAM, 128GB storage, 50MP triple camera system, and 5000mAh battery with 45W fast charging. A perfect blend of performance and affordability.',
  'هاتف ذكي 6.4 بوصة بشاشة Super AMOLED FHD+ 90Hz ومعالج Snapdragon 778G وذاكرة 8GB وتخزين 128GB وكاميرا ثلاثية 50 ميغابيكسل وبطارية 5000mAh مع شحن سريع 45W. مزيج مثالي من الأداء والسعر.',
  'Smartphones & Tablets',
  499.00,
  '/images/Smartphones & Tablets/NeonPhone Lite (499$).png',
  70,
  4.50
),
(
  'NeonPhone X1',
  'نيون فون إكس ون',
  'Flagship 6.7-inch smartphone with Dynamic AMOLED 2X 120Hz display, Snapdragon 8 Gen 3, 12GB RAM, 512GB storage, 200MP periscope camera array, 5500mAh battery, and titanium frame. The pinnacle of mobile technology.',
  'هاتف رائد 6.7 بوصة بشاشة Dynamic AMOLED 2X 120Hz ومعالج Snapdragon 8 Gen 3 وذاكرة 12GB وتخزين 512GB وكاميرا بريسكوب 200 ميغابيكسل وبطارية 5500mAh وإطار تيتانيوم. قمة التكنولوجيا المحمولة.',
  'Smartphones & Tablets',
  1099.00,
  '/images/Smartphones & Tablets/NeonPhone X1 (1099$).png',
  50,
  4.90
);

-- ── Sample Reviews ────────────────────────────────────────────
-- (These reviews also trigger the rating update triggers)
-- We manually set ratings in Products above, and reviews reference user IDs 2-4
-- Note: In production use real user IDs after registering via the app.

-- ── Sample Wishlist ───────────────────────────────────────────
-- (Populated via app interactions; left empty in seed for clean start)

-- ── Verify ───────────────────────────────────────────────────
SELECT 'Users:'    AS tbl, COUNT(*) AS rows FROM Users
UNION ALL
SELECT 'Products:' AS tbl, COUNT(*) AS rows FROM Products;
