#!/usr/bin/env node

/**
 * Deploy Helper Script
 * Script untuk membantu proses deployment aplikasi IWARE Perizinan
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 IWARE Perizinan - Deploy Helper\n');
console.log('='.repeat(50));

// Generate JWT Secret
function generateJWTSecret() {
  return crypto.randomBytes(32).toString('hex');
}

// Validate environment files
function validateEnvFiles() {
  const files = [
    'backend/.env.example',
    'backend/.env.railway',
    'frontend/.env.railway',
    'frontend/.env.production'
  ];

  console.log('\n📋 Checking environment files...\n');
  
  files.forEach(file => {
    const exists = fs.existsSync(path.join(__dirname, file));
    console.log(`${exists ? '✅' : '❌'} ${file}`);
  });
}

// Generate deployment configuration
function generateDeployConfig() {
  const jwtSecret = generateJWTSecret();
  
  console.log('\n🔐 Generated JWT Secret:\n');
  console.log(`JWT_SECRET=${jwtSecret}`);
  console.log('\n⚠️  SIMPAN SECRET INI! Anda akan membutuhkannya untuk Railway Variables.\n');
  
  return jwtSecret;
}

// Display deployment URLs template
function displayURLTemplate() {
  console.log('\n📝 Template Environment Variables:\n');
  console.log('='.repeat(50));
  
  console.log('\n🔧 BACKEND (Railway Variables):');
  console.log('─'.repeat(50));
  console.log(`DB_HOST=\${{MySQL.MYSQLHOST}}
DB_PORT=\${{MySQL.MYSQLPORT}}
DB_NAME=\${{MySQL.MYSQLDATABASE}}
DB_USER=\${{MySQL.MYSQLUSER}}
DB_PASSWORD=\${{MySQL.MYSQLPASSWORD}}
JWT_SECRET=<paste-generated-secret-above>
PORT=5000
NODE_ENV=production
FRONTEND_URL=<your-frontend-url>`);

  console.log('\n\n🎨 FRONTEND (Railway/Vercel Variables):');
  console.log('─'.repeat(50));
  console.log('REACT_APP_API_URL=<your-backend-url>');
}

// Display deployment checklist
function displayChecklist() {
  console.log('\n\n✅ Deployment Checklist:\n');
  console.log('='.repeat(50));
  
  const checklist = [
    'Push code ke GitHub',
    'Buat MySQL database di Railway',
    'Import init-db.sql ke database',
    'Deploy backend ke Railway (root: backend)',
    'Set backend environment variables',
    'Generate domain untuk backend',
    'Deploy frontend ke Railway/Vercel (root: frontend)',
    'Set frontend environment variables',
    'Update FRONTEND_URL di backend',
    'Test login dengan admin/admin123'
  ];
  
  checklist.forEach((item, index) => {
    console.log(`${index + 1}. [ ] ${item}`);
  });
}

// Display useful commands
function displayCommands() {
  console.log('\n\n🛠️  Useful Commands:\n');
  console.log('='.repeat(50));
  
  console.log('\n# Generate JWT Secret:');
  console.log('node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  
  console.log('\n# Create Admin User (after database setup):');
  console.log('cd backend && node scripts/create-admin.js');
  
  console.log('\n# Test Backend Health:');
  console.log('curl https://your-backend-url/api/health');
  
  console.log('\n# Test Login:');
  console.log('curl -X POST https://your-backend-url/api/auth/login \\');
  console.log('  -H "Content-Type: application/json" \\');
  console.log('  -d \'{"username":"admin","password":"admin123"}\'');
}

// Main function
function main() {
  validateEnvFiles();
  const jwtSecret = generateDeployConfig();
  displayURLTemplate();
  displayChecklist();
  displayCommands();
  
  console.log('\n\n📚 Untuk panduan lengkap, baca:');
  console.log('   - DEPLOYMENT-GUIDE.md (panduan detail)');
  console.log('   - QUICK-DEPLOY.md (checklist cepat)');
  
  console.log('\n' + '='.repeat(50));
  console.log('🎉 Siap untuk deployment! Good luck!\n');
  
  // Save JWT secret to file for reference
  const configFile = path.join(__dirname, '.deploy-config.txt');
  fs.writeFileSync(configFile, `JWT_SECRET=${jwtSecret}\nGenerated: ${new Date().toISOString()}\n`);
  console.log(`💾 JWT Secret disimpan di: .deploy-config.txt\n`);
}

// Run the script
main();
