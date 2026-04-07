import cors from 'cors';
import express from 'express';
import { getServerConfig } from './config.js';
import { checkDatabaseConnection } from './db.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_request, response) => {
  response.json({ ok: true });
});

app.get('/api/db/status', async (_request, response) => {
  try {
    const result = await checkDatabaseConnection();
    response.json({
      ok: true,
      database: 'connected',
      result,
    });
  } catch (error) {
    response.status(503).json({
      ok: false,
      database: 'disconnected',
      message: error.message,
      code: error.code || null,
    });
  }
});

try {
  const { port } = getServerConfig();

  app.listen(port, () => {
    console.log(`API server listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
