#!/usr/bin/env node

/**
 * Pre-Deployment Checker
 * Verifikasi kesiapan aplikasi sebelum deploy ke Railway
 * 
 * Usage: node check-deployment-ready.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Deployment Readiness...\n');
console.log('━'.repeat(60));

let errors = [];
let warnings = [];
let passed = 0;
let total = 0;

// Helper functions
function check(name, condition, errorMsg, warningMsg = null) {
  total++;
  if (condition) {
    console.log(`✅ ${name}`);
    passed++;
  } else if (warningMsg) {
    console.log(`⚠️  ${name} - ${warningMsg}`);
    warnings.push(warningMsg);
  } else {
    console.log(`❌ ${name} - ${errorMsg}`);
    errors.push(errorMsg);
  }
}

function fileExists(filePath) {
  return fs.existsSync(path.join(__dirname, filePath));
}

function readFile(filePath) {
  try {
    return fs.readFileSync(path.join(__dirname, filePath), 'utf8');
  } catch (e) {
    return null;
  }
}

// Start checks
console.log('\n📁 File Structure Checks\n');

check(
  'Backend package.json exists',
  fileExists('backend/package.json'),
  'backend/package.json not found'
);

check(
  'Frontend package.json exists',
  fileExists('frontend/package.json'),
  'frontend/package.json not found'
);

check(
  'Database schema exists',
  fileExists('backend/config/init-db.sql'),
  'backend/config/init-db.sql not found'
);

check(
  'Backend server.js exists',
  fileExists('backend/server.js'),
  'backend/server.js not found'
);

check(
  'Frontend src/index.js exists',
  fileExists('frontend/src/index.js'),
  'frontend/src/index.js not found'
);

console.log('\n⚙️  Configuration Checks\n');

check(
  'Railway config exists',
  fileExists('railway.json'),
  'railway.json not found'
);

check(
  'Backend railway.toml exists',
  fileExists('backend/railway.toml'),
  'backend/railway.toml not found'
);

check(
  'Frontend railway.toml exists',
  fileExists('frontend/railway.toml'),
  'frontend/railway.toml not found'
);

check(
  'Backend .env.railway template exists',
  fileExists('backend/.env.railway'),
  'backend/.env.railway not found'
);

check(
  'Frontend .env.railway template exists',
  fileExists('frontend/.env.railway'),
  'frontend/.env.railway not found'
);

console.log('\n📦 Dependencies Checks\n');

const backendPackage = readFile('backend/package.json');
if (backendPackage) {
  const pkg = JSON.parse(backendPackage);
  
  check(
    'Backend has start script',
    pkg.scripts && pkg.scripts.start,
    'Backend package.json missing "start" script'
  );
  
  check(
    'Backend has required dependencies',
    pkg.dependencies && 
    pkg.dependencies.express && 
    pkg.dependencies.mysql2 &&
    pkg.dependencies.cors &&
    pkg.dependencies.bcryptjs &&
    pkg.dependencies.jsonwebtoken,
    'Backend missing required dependencies'
  );
}

const frontendPackage = readFile('frontend/package.json');
if (frontendPackage) {
  const pkg = JSON.parse(frontendPackage);
  
  check(
    'Frontend has build script',
    pkg.scripts && pkg.scripts.build,
    'Frontend package.json missing "build" script'
  );
  
  check(
    'Frontend has serve script',
    pkg.scripts && pkg.scripts.serve,
    'Frontend package.json missing "serve" script',
    'Add "serve": "serve -s build -l $PORT" to scripts'
  );
  
  check(
    'Frontend has required dependencies',
    pkg.dependencies && 
    pkg.dependencies.react && 
    pkg.dependencies['react-dom'] &&
    pkg.dependencies['react-router-dom'],
    'Frontend missing required dependencies'
  );
}

console.log('\n🔐 Security Checks\n');

check(
  '.gitignore exists',
  fileExists('.gitignore'),
  '.gitignore not found'
);

const gitignore = readFile('.gitignore');
if (gitignore) {
  check(
    '.gitignore includes .env',
    gitignore.includes('.env'),
    '.gitignore should include .env files'
  );
  
  check(
    '.gitignore includes node_modules',
    gitignore.includes('node_modules'),
    '.gitignore should include node_modules'
  );
  
  check(
    '.gitignore includes CREDENTIALS.md',
    gitignore.includes('CREDENTIALS.md'),
    '.gitignore should include CREDENTIALS.md'
  );
}

check(
  'Backend .env not committed',
  !fileExists('backend/.env') || gitignore.includes('.env'),
  'backend/.env should not be committed',
  'Make sure .env is in .gitignore'
);

console.log('\n📚 Documentation Checks\n');

check(
  'README.md exists',
  fileExists('README.md'),
  'README.md not found'
);

check(
  'DEPLOYMENT.md exists',
  fileExists('DEPLOYMENT.md'),
  'DEPLOYMENT.md not found'
);

check(
  'QUICK-DEPLOY.md exists',
  fileExists('QUICK-DEPLOY.md'),
  'QUICK-DEPLOY.md not found'
);

console.log('\n🛠️  Helper Scripts Checks\n');

check(
  'Generate JWT secret script exists',
  fileExists('backend/scripts/generate-jwt-secret.js'),
  'generate-jwt-secret.js not found'
);

check(
  'Generate hash script exists',
  fileExists('backend/scripts/generate-hash.js'),
  'generate-hash.js not found'
);

check(
  'Create admin script exists',
  fileExists('backend/scripts/create-admin.js'),
  'create-admin.js not found'
);

console.log('\n━'.repeat(60));
console.log('\n📊 Summary\n');
console.log(`Total Checks: ${total}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${errors.length}`);
console.log(`⚠️  Warnings: ${warnings.length}`);

if (errors.length > 0) {
  console.log('\n❌ Errors Found:\n');
  errors.forEach((err, i) => {
    console.log(`${i + 1}. ${err}`);
  });
}

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:\n');
  warnings.forEach((warn, i) => {
    console.log(`${i + 1}. ${warn}`);
  });
}

console.log('\n━'.repeat(60));

if (errors.length === 0) {
  console.log('\n✅ All checks passed! Ready to deploy! 🚀\n');
  console.log('Next steps:');
  console.log('1. Read QUICK-DEPLOY.md or DEPLOYMENT.md');
  console.log('2. Create Railway account');
  console.log('3. Push code to GitHub');
  console.log('4. Follow deployment guide\n');
  process.exit(0);
} else {
  console.log('\n❌ Please fix the errors before deploying.\n');
  console.log('Run this script again after fixing the issues.\n');
  process.exit(1);
}
