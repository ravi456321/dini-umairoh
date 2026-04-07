import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getServerConfig() {
  return {
    port: Number(process.env.PORT || 3001),
    db: {
      host: requireEnv('DB_HOST'),
      port: Number(process.env.DB_PORT || 3306),
      user: requireEnv('DB_USER'),
      password: requireEnv('DB_PASSWORD'),
      database: requireEnv('DB_NAME'),
    },
  };
}

