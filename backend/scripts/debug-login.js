const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

// Script untuk debug masalah login
async function debugLogin() {
  console.log('=== DEBUG LOGIN ADMIN ===\n');
  
  // Test 1: Verify bcrypt hash
  console.log('Test 1: Verifying bcrypt hash...');
  const password = 'admin123';
  const hash = '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
  
  const isValid = await bcrypt.compare(password, hash);
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('Valid:', isValid ? '✅ YES' : '❌ NO');
  console.log('');
  
  // Test 2: Check database connection
  console.log('Test 2: Checking database connection...');
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'iware_perizinan'
    });
    
    console.log('✅ Database connected successfully');
    console.log('Database:', process.env.DB_NAME || 'iware_perizinan');
    console.log('');
    
    // Test 3: Check if admin user exists
    console.log('Test 3: Checking admin user in database...');
    const [users] = await connection.query('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (users.length === 0) {
      console.log('❌ Admin user NOT FOUND in database!');
      console.log('\nSOLUTION: Run this SQL:');
      console.log("DELETE FROM users WHERE username = 'admin';");
      console.log(`INSERT INTO users (username, password, nama, role) VALUES ('admin', '${hash}', 'Administrator', 'admin');`);
    } else {
      const user = users[0];
      console.log('✅ Admin user found!');
      console.log('ID:', user.id);
      console.log('Username:', user.username);
      console.log('Nama:', user.nama);
      console.log('Role:', user.role);
      console.log('Password Hash:', user.password);
      console.log('');
      
      // Test 4: Verify password with database hash
      console.log('Test 4: Verifying password with database hash...');
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password:', password);
      console.log('Database Hash:', user.password);
      console.log('Match:', isMatch ? '✅ YES' : '❌ NO');
      
      if (!isMatch) {
        console.log('\n❌ PASSWORD DOES NOT MATCH!');
        console.log('\nSOLUTION: Update password hash in database:');
        console.log(`UPDATE users SET password = '${hash}' WHERE username = 'admin';`);
      } else {
        console.log('\n✅ ALL TESTS PASSED! Login should work.');
        console.log('\nCredentials:');
        console.log('Username: admin');
        console.log('Password: admin123');
      }
    }
    
    await connection.end();
  } catch (error) {
    console.log('❌ Database connection failed!');
    console.log('Error:', error.message);
    console.log('\nCheck your .env file:');
    console.log('DB_HOST=' + (process.env.DB_HOST || 'localhost'));
    console.log('DB_USER=' + (process.env.DB_USER || 'root'));
    console.log('DB_NAME=' + (process.env.DB_NAME || 'iware_perizinan'));
  }
}

debugLogin().catch(console.error);
