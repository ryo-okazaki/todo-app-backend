import express from 'express';

import apiRoutes from './routes/api-routes.js';

const app = express();

app.use(express.json());

// Health check API
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// API routes
app.use('/api', apiRoutes);

export default app;
