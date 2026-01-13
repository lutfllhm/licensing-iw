const bcrypt = require('bcryptjs');

// Script untuk generate bcrypt hash
// Usage: node backend/scripts/generate-hash.js [password]

const password = process.argv[2] || 'admin123';
const saltRounds = 10;

console.log('Generating bcrypt hash...\n');

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n✅ Copy hash di atas untuk digunakan di database');
  console.log('\nContoh SQL:');
  console.log(`INSERT INTO users (username, password, nama, role) VALUES ('username', '${hash}', 'Nama User', 'hrd');`);
});
