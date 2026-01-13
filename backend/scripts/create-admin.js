const bcrypt = require('bcryptjs');

// Script untuk membuat hash admin yang benar
const password = 'admin123';
const saltRounds = 10;

console.log('=== GENERATING ADMIN PASSWORD HASH ===\n');
console.log('Password:', password);
console.log('Salt Rounds:', saltRounds);
console.log('\nGenerating hash...\n');

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error generating hash:', err);
    process.exit(1);
  }
  
  console.log('✅ Hash generated successfully!\n');
  console.log('Hash:', hash);
  console.log('\n=== SQL QUERY ===\n');
  console.log('-- Delete existing admin (if any)');
  console.log("DELETE FROM users WHERE username = 'admin';\n");
  console.log('-- Insert new admin with hashed password');
  console.log(`INSERT INTO users (username, password, nama, role)`);
  console.log(`VALUES ('admin', '${hash}', 'Administrator', 'admin');\n`);
  
  console.log('=== VERIFYING HASH ===\n');
  
  // Verify the hash works
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('❌ Error verifying:', err);
      process.exit(1);
    }
    
    if (result) {
      console.log('✅ Verification SUCCESS! Hash is correct.');
      console.log('\nYou can now use this hash in your database.');
    } else {
      console.log('❌ Verification FAILED! Something went wrong.');
    }
  });
});
