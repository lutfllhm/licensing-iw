const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '../.env.railway.local') });

async function testConnection() {
  console.log('🔍 Testing Railway MySQL Connection...\n');
  
  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.DB_HOST}`);
  console.log(`   Port: ${process.env.DB_PORT}`);
  console.log(`   User: ${process.env.DB_USER}`);
  console.log(`   Database: ${process.env.DB_NAME}`);
  console.log(`   Password: ${process.env.DB_PASSWORD ? '***' : '(empty)'}\n`);

  try {
    // Test connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✅ Connection successful!\n');

    // Test query
    const [rows] = await connection.query('SELECT 1 + 1 AS result');
    console.log('✅ Query test passed:', rows[0]);

    // Check tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Tables in database:');
    if (tables.length === 0) {
      console.log('   ⚠️  No tables found. Run init-railway-db.js to create tables.');
    } else {
      tables.forEach(table => {
        console.log(`   - ${Object.values(table)[0]}`);
      });
    }

    // Check users
    try {
      const [users] = await connection.query('SELECT id, username, nama, role FROM users');
      console.log('\n👥 Users in database:');
      if (users.length === 0) {
        console.log('   ⚠️  No users found.');
      } else {
        users.forEach(user => {
          console.log(`   - ${user.username} (${user.role}) - ${user.nama}`);
        });
      }
    } catch (err) {
      console.log('\n⚠️  Users table not found or empty');
    }

    await connection.end();
    console.log('\n✅ Connection test completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check if MySQL service is running in Railway');
    console.error('   2. Verify credentials in .env.railway.local');
    console.error('   3. Check if your IP is allowed (Railway usually allows all)');
    console.error('   4. Ensure DB_HOST includes the correct domain');
    process.exit(1);
  }
}

testConnection();
