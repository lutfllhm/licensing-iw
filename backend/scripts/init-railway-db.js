const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDatabase() {
  console.log('🔄 Initializing Railway MySQL database...');
  
  try {
    // Connect tanpa database terlebih dahulu
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT || 3306,
      multipleStatements: true
    });

    console.log('✅ Connected to MySQL server');

    // Baca file SQL
    const sqlFile = path.join(__dirname, '../config/init-db.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    // Execute SQL
    await connection.query(sql);
    console.log('✅ Database initialized successfully');

    // Verify tables
    await connection.query(`USE ${process.env.DB_NAME || 'iware_perizinan'}`);
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tables created:', tables);

    await connection.end();
    console.log('✅ Database initialization complete!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    process.exit(1);
  }
}

initDatabase();
