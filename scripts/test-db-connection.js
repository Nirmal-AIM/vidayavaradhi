// Script to test database connection
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'u941670923_vidayavaradhi',
    password: process.env.DB_PASSWORD || 'Vidyavaradhi1234',
    database: process.env.DB_NAME || 'u941670923_vidyavaradhi'
  });

  try {
    console.log('Connecting to database...');
    await connection.connect();
    console.log('✅ Database connection successful!');
    
    // Test query
    console.log('Testing query execution...');
    const [rows] = await connection.execute('SHOW TABLES');
    console.log('Available tables:');
    rows.forEach(row => {
      console.log(`- ${Object.values(row)[0]}`);
    });
    
    console.log('\nDatabase connection test completed successfully.');
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('Please check your username and password.');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Please check if the database server is running and accessible.');
    }
  } finally {
    await connection.end();
  }
}

testConnection();