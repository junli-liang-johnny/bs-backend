-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on completed column for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);
