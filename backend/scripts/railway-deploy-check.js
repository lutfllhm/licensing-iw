#!/usr/bin/env node

/**
 * Railway Deployment Checker
 * Script untuk mengecek apakah environment variables sudah di-set dengan benar
 */

require('dotenv').config();

console.log('🔍 Railway Deployment Check\n');
console.log('=' .repeat(50));

const checks = {
  '✅ PASSED': [],
  '⚠️  WARNING': [],
  '❌ FAILED': []
};

// Check Database Connection
console.log('\n📊 Database Configuration:');
console.log('-'.repeat(50));

if (process.env.MYSQL_URL) {
  checks['✅ PASSED'].push('MYSQL_URL is set');
  console.log('✅ MYSQL_URL: SET');
  // Mask password in URL
  const maskedUrl = process.env.MYSQL_URL.replace(/:([^@]+)@/, ':****@');
  console.log(`   ${maskedUrl}`);
} else {
  checks['❌ FAILED'].push('MYSQL_URL is not set');
  console.log('❌ MYSQL_URL: NOT SET');
}

const dbVars = ['MYSQLHOST', 'MYSQLPORT', 'MYSQLUSER', 'MYSQLPASSWORD', 'MYSQLDATABASE'];
dbVars.forEach(varName => {
  if (process.env[varName]) {
    checks['✅ PASSED'].push(`${varName} is set`);
    console.log(`✅ ${varName}: ${varName.includes('PASSWORD') ? '****' : process.env[varName]}`);
  } else {
    checks['⚠️  WARNING'].push(`${varName} is not set (optional if MYSQL_URL is set)`);
    console.log(`⚠️  ${varName}: NOT SET`);
  }
});

// Check Application Configuration
console.log('\n⚙️  Application Configuration:');
console.log('-'.repeat(50));

if (process.env.JWT_SECRET) {
  checks['✅ PASSED'].push('JWT_SECRET is set');
  console.log('✅ JWT_SECRET: SET');
  console.log(`   Length: ${process.env.JWT_SECRET.length} characters`);
  if (process.env.JWT_SECRET.length < 32) {
    checks['⚠️  WARNING'].push('JWT_SECRET should be at least 32 characters');
    console.log('   ⚠️  Warning: Consider using a longer secret (32+ chars)');
  }
} else {
  checks['❌ FAILED'].push('JWT_SECRET is not set');
  console.log('❌ JWT_SECRET: NOT SET');
}

if (process.env.PORT) {
  checks['✅ PASSED'].push('PORT is set');
  console.log(`✅ PORT: ${process.env.PORT}`);
} else {
  checks['⚠️  WARNING'].push('PORT not set (will default to 5000)');
  console.log('⚠️  PORT: NOT SET (will use default: 5000)');
}

if (process.env.NODE_ENV) {
  checks['✅ PASSED'].push('NODE_ENV is set');
  console.log(`✅ NODE_ENV: ${process.env.NODE_ENV}`);
  if (process.env.NODE_ENV !== 'production') {
    checks['⚠️  WARNING'].push('NODE_ENV is not set to production');
    console.log('   ⚠️  Warning: Should be "production" for Railway');
  }
} else {
  checks['⚠️  WARNING'].push('NODE_ENV not set');
  console.log('⚠️  NODE_ENV: NOT SET (should be "production")');
}

// Check CORS Configuration
console.log('\n🌐 CORS Configuration:');
console.log('-'.repeat(50));

if (process.env.FRONTEND_URL) {
  checks['✅ PASSED'].push('FRONTEND_URL is set');
  console.log(`✅ FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  
  // Check if URL is valid
  try {
    new URL(process.env.FRONTEND_URL);
  } catch (e) {
    checks['❌ FAILED'].push('FRONTEND_URL is not a valid URL');
    console.log('   ❌ Error: Not a valid URL');
  }
} else {
  checks['⚠️  WARNING'].push('FRONTEND_URL not set (CORS might fail)');
  console.log('⚠️  FRONTEND_URL: NOT SET');
  console.log('   ⚠️  Warning: Set this after frontend is deployed');
}

// Test Database Connection
console.log('\n🔌 Testing Database Connection:');
console.log('-'.repeat(50));

(async () => {
  try {
    const db = require('../config/database');
    await db.query('SELECT 1');
    checks['✅ PASSED'].push('Database connection successful');
    console.log('✅ Database connection: SUCCESS');
    
    // Check if tables exist
    const [tables] = await db.query("SHOW TABLES");
    if (tables.length > 0) {
      checks['✅ PASSED'].push('Database tables exist');
      console.log(`✅ Database tables: ${tables.length} tables found`);
      tables.forEach(table => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    } else {
      checks['⚠️  WARNING'].push('No tables found (will be created on first run)');
      console.log('⚠️  Database tables: EMPTY (will be initialized)');
    }
    
    await db.end();
  } catch (error) {
    checks['❌ FAILED'].push('Database connection failed');
    console.log('❌ Database connection: FAILED');
    console.log(`   Error: ${error.message}`);
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📋 SUMMARY');
  console.log('='.repeat(50));
  
  Object.keys(checks).forEach(status => {
    if (checks[status].length > 0) {
      console.log(`\n${status}:`);
      checks[status].forEach(item => {
        console.log(`  • ${item}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(50));
  
  if (checks['❌ FAILED'].length > 0) {
    console.log('❌ DEPLOYMENT CHECK FAILED');
    console.log('Please fix the issues above before deploying.');
    process.exit(1);
  } else if (checks['⚠️  WARNING'].length > 0) {
    console.log('⚠️  DEPLOYMENT CHECK PASSED WITH WARNINGS');
    console.log('Review warnings above. Deployment should work but may need adjustments.');
    process.exit(0);
  } else {
    console.log('✅ DEPLOYMENT CHECK PASSED');
    console.log('All checks passed! Ready to deploy to Railway.');
    process.exit(0);
  }
})();
