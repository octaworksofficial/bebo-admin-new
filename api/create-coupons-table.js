require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS coupons (
      id SERIAL PRIMARY KEY,
      code VARCHAR(50) UNIQUE NOT NULL,
      discount_type VARCHAR(20) NOT NULL,
      discount_value DECIMAL(10,2) NOT NULL,
      applicability VARCHAR(20) NOT NULL,
      product_id INTEGER REFERENCES product(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_active BOOLEAN DEFAULT TRUE,
      usage_count INTEGER DEFAULT 0
    );
  `;
  try {
    await pool.query(query);
    console.log('Coupons table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    pool.end();
  }
}

createTable();
