const bcrypt = require('bcryptjs');

// Script untuk verify password dengan hash
// Usage: node backend/scripts/verify-password.js [password] [hash]

const password = process.argv[2] || 'admin123';
const hash = process.argv[3] || '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

console.log('Verifying password...\n');
console.log('Password:', password);
console.log('Hash:', hash);
console.log('');

bcrypt.compare(password, hash, (err, result) => {
  if (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
  
  if (result) {
    console.log('✅ Password MATCH! Hash is correct.');
  } else {
    console.log('❌ Password DOES NOT MATCH! Hash is incorrect.');
  }
});
