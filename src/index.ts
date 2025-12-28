import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { testConnection } from './db.js';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', async (req: Request, res: Response) => {
  try {
    const dbStatus = await testConnection();
    res.json({
      status: 'ok',
      message: 'Server is running',
      environment: process.env.NODE_ENV || 'development',
      database: dbStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Health check failed',
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Tasks endpoints (example CRUD operations)
app.get('/api/tasks', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to fetch tasks',
    });
  }
});

app.post('/api/tasks', async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description, completed) VALUES ($1, $2, $3) RETURNING *',
      [title, description || '', false]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to create task',
    });
  }
});

app.put('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;

    const result = await pool.query(
      'UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), completed = COALESCE($3, completed) WHERE id = $4 RETURNING *',
      [title, description, completed, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to update task',
    });
  }
});

app.delete('/api/tasks/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted', task: result.rows[0] });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Failed to delete task',
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  testConnection().then((status) => {
    console.log('Database status:', status);
  });
});
