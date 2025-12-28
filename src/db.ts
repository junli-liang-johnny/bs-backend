import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'postgres',
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('PostgreSQL connection successful');
    return {
      status: 'connected',
      message: 'Successfully connected to PostgreSQL',
      timestamp: result.rows[0].now,
    };
  } catch (error) {
    console.error('PostgreSQL connection failed:', error);
    return {
      status: 'disconnected',
      message: `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
};

export default pool;
