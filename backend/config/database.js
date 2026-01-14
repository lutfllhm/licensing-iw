const mysql = require('mysql2');
require('dotenv').config();

// Railway MySQL Connection
// Prioritas: MYSQL_URL > Individual credentials > Local defaults
let pool;

if (process.env.MYSQL_URL) {
  // Gunakan connection string dari Railway (format: mysql://user:pass@host:port/database)
  console.log('📡 Using MYSQL_URL connection string');
  pool = mysql.createPool({
    uri: process.env.MYSQL_URL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} else {
  // Fallback ke individual credentials
  console.log('📡 Using individual database credentials');
  pool = mysql.createPool({
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
    user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
    password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || '',
    database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'iware_perizinan',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

const promisePool = pool.promise();

module.exports = promisePool;
