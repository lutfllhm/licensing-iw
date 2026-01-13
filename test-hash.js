// Test bcrypt hash untuk admin123
const bcrypt = require('bcryptjs');

const password = 'admin123';

// Generate hash
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error:', err);
    return;
  }
  
  console.log('\n=== BCRYPT HASH GENERATOR ===\n');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\n=== VERIFY HASH ===\n');
  
  // Verify hash
  bcrypt.compare(password, hash, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Verification:', result ? '✅ MATCH' : '❌ NO MATCH');
  });
  
  // Test dengan hash yang ada di database
  const existingHash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  console.log('\n=== TEST EXISTING HASH ===\n');
  console.log('Existing Hash:', existingHash);
  
  bcrypt.compare(password, existingHash, (err, result) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
    console.log('Verification:', result ? '✅ MATCH' : '❌ NO MATCH');
  });
});
