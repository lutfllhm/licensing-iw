#!/usr/bin/env node

/**
 * Generate JWT Secret untuk Railway
 * 
 * Usage:
 *   node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 JWT Secret Generator\n');
console.log('━'.repeat(60));

// Generate 32 bytes random string
const secret = crypto.randomBytes(32).toString('hex');

console.log('\n✅ JWT Secret berhasil di-generate!\n');
console.log('Copy secret berikut ke Railway Variables:\n');
console.log(`JWT_SECRET=${secret}\n`);
console.log('━'.repeat(60));
console.log('\n📝 Cara setup di Railway:');
console.log('1. Buka Railway Dashboard');
console.log('2. Pilih Backend service');
console.log('3. Klik tab "Variables"');
console.log('4. Edit JWT_SECRET dengan value di atas');
console.log('5. Save (backend akan auto-restart)\n');
