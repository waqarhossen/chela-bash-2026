const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrl = envFile.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1];

const sql = neon(dbUrl);

async function setupDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        age INTEGER NOT NULL,
        relationship VARCHAR(255) NOT NULL,
        adults INTEGER NOT NULL DEFAULT 1,
        children INTEGER NOT NULL DEFAULT 0,
        notes TEXT,
        token VARCHAR(50) UNIQUE NOT NULL,
        status VARCHAR(20) DEFAULT 'reserved',
        confirmed_adults INTEGER,
        confirmed_children INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Database table created successfully');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
