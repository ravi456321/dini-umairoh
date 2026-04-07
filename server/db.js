import mysql from 'mysql2/promise';
import { getServerConfig } from './config.js';

let pool;

export function getDbPool() {
  if (!pool) {
    const { db } = getServerConfig();

    pool = mysql.createPool({
      host: db.host,
      port: db.port,
      user: db.user,
      password: db.password,
      database: db.database,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000,
      enableKeepAlive: true,
    });
  }

  return pool;
}

export async function checkDatabaseConnection() {
  const connection = await getDbPool().getConnection();

  try {
    const [rows] = await connection.query('SELECT 1 AS ok');
    return rows[0];
  } finally {
    connection.release();
  }
}

