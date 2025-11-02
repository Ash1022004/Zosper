const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(process.cwd(), 'server');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

function readJson(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data;
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function getAllUsers() {
  return readJson(USERS_FILE, []);
}

function saveAllUsers(users) {
  writeJson(USERS_FILE, users);
}

function getUserByEmail(email) {
  const emailLower = email.toLowerCase().trim();
  return getAllUsers().find(u => u.email.toLowerCase().trim() === emailLower) || null;
}

function createUser({ email, password_hash, role, name }) {
  const users = getAllUsers();
  const id = users.length ? Math.max(...users.map(u => u.id || 0)) + 1 : 1;
  const user = { id, email, password_hash, role: role || 'user', name: name || null };
  users.push(user);
  saveAllUsers(users);
  return { id: user.id, email: user.email, role: user.role, name: user.name };
}

function ensureAdmin(email, password) {
  const u = getUserByEmail(email);
  if (u && u.role === 'admin') return; // Admin exists, don't recreate
  if (u) {
    // User exists but not admin, update to admin
    const users = getAllUsers();
    // FIX: Normalize email case for comparison to match getUserByEmail behavior
    const emailNormalized = email.toLowerCase().trim();
    const user = users.find(us => us.email.toLowerCase().trim() === emailNormalized);
    if (user) {
      const hash = bcrypt.hashSync(password, 10);
      user.password_hash = hash;
      user.role = 'admin';
      saveAllUsers(users);
      return;
    }
  }
  // Create new admin
  const hash = bcrypt.hashSync(password, 10);
  createUser({ email, password_hash: hash, role: 'admin' });
}

module.exports = { getUserByEmail, createUser, ensureAdmin };

