const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Serve 'public' directory
app.use(express.static('public'));

// In-memory storage for tasks
let tasks = [];

/*
  tasks Example:
  {
    id: 1,
    title: 'Sample Task',
    note: 'Some notes here...',
    priority: 'High'
  }
*/

// In-memory storage for a single blackboard message
let blackboardMessage = "";

/********************************************************
 *  TASK ENDPOINTS
 ********************************************************/
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

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

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, note, priority } = req.body;
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  if (!title || !priority) {
    return res.status(400).json({ error: 'Title and priority are required.' });
  }
  tasks[index].title = title;
  tasks[index].note = note;
  tasks[index].priority = priority;
  res.json(tasks[index]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  const removedTask = tasks.splice(index, 1);
  res.json({ message: 'Task deleted', deletedTask: removedTask[0] });
});

/********************************************************
 *  BLACKBOARD ENDPOINTS
 ********************************************************/
// Get the current blackboard message
app.get('/api/blackboard', (req, res) => {
  res.json({ message: blackboardMessage });
});

// Update the blackboard message
app.post('/api/blackboard', (req, res) => {
  const { message } = req.body;
  if (message === undefined) {
    return res.status(400).json({ error: 'Message text is required.' });
  }
  blackboardMessage = message;
  res.json({ message: blackboardMessage });
});

/********************************************************
 *  START SERVER
 ********************************************************/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SatisBoard server running on port ${PORT}`);
});
