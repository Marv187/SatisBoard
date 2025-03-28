const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve the 'public' directory for static files
app.use(express.static('public'));

// In-memory storage for tasks
let tasks = [];

/* 
  Example of a task object:
  {
    id: 1,
    title: 'Sample Task',
    note: 'Some notes here...',
    priority: 'High'
  }
*/

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// CREATE a new task
app.post('/api/tasks', (req, res) => {
  const { title, note, priority } = req.body;

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

// UPDATE an existing task
app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, note, priority } = req.body;
  
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }

  // Basic validation
  if (!title || !priority) {
    return res.status(400).json({ error: 'Title and priority are required for editing.' });
  }

  // Update fields
  tasks[index].title = title;
  tasks[index].note = note;
  tasks[index].priority = priority;

  res.json(tasks[index]);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  
  // Remove from array
  const removedTask = tasks.splice(index, 1);
  res.json({ message: 'Task deleted', deletedTask: removedTask[0] });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SatisBoard server running on port ${PORT}`);
});
