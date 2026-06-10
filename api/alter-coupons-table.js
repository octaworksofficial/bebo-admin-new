require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function alterTable() {
  try {
    await pool.query(`
      ALTER TABLE coupons 
      ADD COLUMN IF NOT EXISTS max_usage_per_user INTEGER DEFAULT 1,
      ADD COLUMN IF NOT EXISTS max_total_usage INTEGER;
    `);
    console.log('Coupons table altered successfully');
  } catch (err) {
    console.error('Error altering table:', err);
  } finally {
    pool.end();
  }
}

alterTable();
