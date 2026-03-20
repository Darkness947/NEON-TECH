// ============================================================
// database/hash_passwords.js
// Helper: Generate real bcrypt hashes for seed users
// Run: node database/hash_passwords.js
// ============================================================
'use strict';

const bcrypt = require('bcryptjs');

const users = [
  { email: 'admin@neontech.com', password: 'Admin@123' },
  { email: 'alice@example.com',  password: 'User@1234' },
  { email: 'bob@example.com',    password: 'User@1234' },
  { email: 'sara@example.com',   password: 'User@1234' },
];

(async () => {
  console.log('-- Real bcrypt hashes for seed.sql:');
  for (const u of users) {
    const hash = await bcrypt.hash(u.password, 12);
    console.log(`-- ${u.email}  =>  '${hash}'`);
  }
})();
