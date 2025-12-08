const { neon } = require('@neondatabase/serverless');
const fs = require('fs');

// Read .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf8');
const dbUrl = envFile.split('\n').find(line => line.startsWith('DATABASE_URL=')).split('=')[1];

const sql = neon(dbUrl);

async function setupAdminUsers() {
  try {
    // Create admin_users table
    await sql`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Admin users table created successfully');

    // Check if waqar already exists
    const existing = await sql`
      SELECT * FROM admin_users WHERE username = 'waqar'
    `;

    if (existing.length === 0) {
      // Insert waqar as super admin
      await sql`
        INSERT INTO admin_users (username, password, role)
        VALUES ('waqar', 'Waa@098)(*', 'super_admin')
      `;
      console.log('✅ Super admin user "waqar" created successfully');
    } else {
      console.log('ℹ️  User "waqar" already exists');
    }

  } catch (error) {
    console.error('❌ Error setting up admin users:', error);
    process.exit(1);
  }
}

setupAdminUsers();
