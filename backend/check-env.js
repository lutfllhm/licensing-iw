// Quick script to check environment variables
require('dotenv').config();

console.log('🔍 Environment Variables Check:\n');

const requiredVars = [
  'DB_HOST',
  'DB_PORT', 
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'JWT_SECRET',
  'PORT'
];

let allSet = true;

requiredVars.forEach(varName => {
  const value = process.env[varName];
  const status = value ? '✅' : '❌';
  const display = value ? (varName.includes('PASSWORD') || varName.includes('SECRET') ? '***' : value) : 'NOT SET';
  console.log(`${status} ${varName}: ${display}`);
  if (!value) allSet = false;
});

console.log('\n' + (allSet ? '✅ All required variables are set!' : '❌ Some variables are missing!'));
console.log('\n📋 Additional Info:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);

process.exit(allSet ? 0 : 1);
