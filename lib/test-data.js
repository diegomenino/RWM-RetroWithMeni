const { getDb } = require('./db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function seedTestData() {
  const db = getDb();

  const users = [
    { email: 'admin@example.com', name: 'Admin User', role: 'admin', active: 1 },
    { email: 'user@example.com', name: 'Regular User', role: 'user', active: 1 },
    { email: 'disabled@example.com', name: 'Disabled User', role: 'user', active: 0 }
  ];

  for (const user of users) {
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(user.email);
    if (!existing) {
      const hash = await bcrypt.hash('password123', 10);
      db.prepare(`
        INSERT INTO users (id, email, display_name, password_hash, provider, role, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, 'local', ?, ?, ?, ?)
      `).run(uuidv4(), user.email, user.name, hash, user.role, user.active, Date.now(), Date.now());
      console.log(`User ${user.email} created`);
    } else {
      console.log(`User ${user.email} already exists`);
    }
  }
}

if (require.main === module) {
  seedTestData().catch(console.error);
}

module.exports = { seedTestData };
