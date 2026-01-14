const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.railway.local') });

async function importDatabase() {
  console.log('🚀 Starting database import to Railway...\n');

  // Validasi environment variables
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  const missing = requiredVars.filter(v => !process.env[v]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing.join(', '));
    console.error('📝 Please update backend/.env.railway.local with Railway credentials');
    process.exit(1);
  }

  // Path ke file SQL backup
  const sqlFile = process.argv[2] || 'iware_perizinan_backup.sql';
  const sqlPath = path.resolve(sqlFile);

  if (!fs.existsSync(sqlPath)) {
    console.error(`❌ SQL file not found: ${sqlPath}`);
    console.error('\n📝 Usage: node backend/scripts/import-to-railway.js [path-to-sql-file]');
    console.error('   Example: node backend/scripts/import-to-railway.js iware_perizinan_backup.sql');
    process.exit(1);
  }

  console.log('📄 SQL File:', sqlPath);
  console.log('🎯 Target Database:', process.env.DB_NAME);
  console.log('🌐 Host:', process.env.DB_HOST);
  console.log('');

  let connection;
  try {
    // Koneksi ke Railway MySQL
    console.log('🔌 Connecting to Railway MySQL...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('✅ Connected successfully!\n');

    // Baca file SQL
    console.log('📖 Reading SQL file...');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL statements (handle multiple statements)
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📊 Found ${statements.length} SQL statements\n`);

    // Execute statements
    console.log('⚙️  Executing SQL statements...');
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < statements.length; i++) {
      try {
        await connection.query(statements[i]);
        successCount++;
        if ((i + 1) % 10 === 0) {
          process.stdout.write(`   Progress: ${i + 1}/${statements.length}\r`);
        }
      } catch (error) {
        errorCount++;
        if (error.code !== 'ER_TABLE_EXISTS_ERROR' && error.code !== 'ER_DUP_ENTRY') {
          console.error(`\n⚠️  Error at statement ${i + 1}:`, error.message);
        }
      }
    }

    console.log(`\n\n✅ Import completed!`);
    console.log(`   Success: ${successCount} statements`);
    console.log(`   Errors: ${errorCount} statements`);

    // Verify tables
    console.log('\n🔍 Verifying imported tables...');
    const [tables] = await connection.query('SHOW TABLES');
    console.log(`   Found ${tables.length} tables:`);
    tables.forEach(table => {
      const tableName = Object.values(table)[0];
      console.log(`   - ${tableName}`);
    });

    console.log('\n🎉 Database import successful!');

  } catch (error) {
    console.error('\n❌ Import failed:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run import
importDatabase();
