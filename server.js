const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve the 'public' directory for static files (index.html, etc.)
app.use(express.static('public'));

// In-memory storage for tasks (for demonstration only!)
let tasks = [];

// Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  const { title, note, priority } = req.body;

  // Simple validation
  if (!title || !priority) {
    return res.status(400).json({ error: 'Title and priority are required.' });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    note: note || '',
    priority
  };
  
  tasks.push(newTask);
  return res.status(201).json(newTask);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SatisBoard server running on port ${PORT}`);
});
