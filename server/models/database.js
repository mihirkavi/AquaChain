import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function query(text, params) {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
}

export async function initDatabase() {
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'household',
      organization_name VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS sensors (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id),
      name VARCHAR(255) NOT NULL,
      location VARCHAR(255),
      sensor_type VARCHAR(50) DEFAULT 'residential',
      wifi_connected BOOLEAN DEFAULT false,
      purifier_active BOOLEAN DEFAULT false,
      last_reading_at TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS readings (
      id SERIAL PRIMARY KEY,
      sensor_id INTEGER REFERENCES sensors(id),
      ph DECIMAL(4,2),
      tds INTEGER,
      turbidity DECIMAL(5,2),
      temperature DECIMAL(4,1),
      chlorine DECIMAL(4,2),
      water_quality_score INTEGER,
      purification_status VARCHAR(50),
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await query(`
    CREATE TABLE IF NOT EXISTS blockchain_transactions (
      id SERIAL PRIMARY KEY,
      reading_id INTEGER REFERENCES readings(id),
      tx_hash VARCHAR(255),
      block_number INTEGER,
      network VARCHAR(50),
      status VARCHAR(50) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const demoUserCheck = await query('SELECT id FROM users WHERE email = $1', ['demo@aquachain.com']);
  if (demoUserCheck.rows.length === 0) {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const userResult = await query(
      'INSERT INTO users (email, password, name, role, organization_name) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['demo@aquachain.com', hashedPassword, 'Demo User', 'business', 'AquaChain Demo Corp']
    );
    
    const userId = userResult.rows[0].id;
    
    await query(
      'INSERT INTO sensors (user_id, name, location, sensor_type, wifi_connected, purifier_active) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, 'Main Office Sensor', 'Building A - Floor 1', 'commercial', true, true]
    );
    await query(
      'INSERT INTO sensors (user_id, name, location, sensor_type, wifi_connected, purifier_active) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, 'Kitchen Sensor', 'Building A - Kitchen', 'commercial', true, true]
    );
    await query(
      'INSERT INTO sensors (user_id, name, location, sensor_type, wifi_connected, purifier_active) VALUES ($1, $2, $3, $4, $5, $6)',
      [userId, 'Home Sensor', 'Residential Unit 101', 'residential', true, false]
    );
    
    console.log('Demo user and sensors created');
  }
}

export default pool;
