import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Global Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`➡️  [${req.method}] ${req.originalUrl}`);
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    console.log(`${statusColor} [${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  
  next();
});

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

import auditRoutes from './routes/auditRoutes.js';
app.use('/api', auditRoutes);

export default app;
