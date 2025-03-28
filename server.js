const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory task and blackboard storage
let tasks = [];
let blackboard = { message: '' };

// ---- TASK ROUTES ----
app.get('/api/tasks', (req, res) => res.json(tasks));

app.post('/api/tasks', (req, res) => {
  const { title, note, priority } = req.body;
  const newTask = {
    id: Date.now(),
    title,
    note,
    priority
  };
  tasks.push(newTask);
  io.emit('taskCreated', newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, note, priority } = req.body;
  const task = tasks.find(t => t.id === taskId);
  if (!task) return res.status(404).send();
  task.title = title;
  task.note = note;
  task.priority = priority;
  io.emit('taskUpdated', task);
  res.sendStatus(200);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter(t => t.id !== taskId);
  io.emit('taskDeleted', { id: taskId });
  res.sendStatus(200);
});

app.post('/api/tasks/reorder', (req, res) => {
  const { orderedIds } = req.body;
  tasks = orderedIds.map(id => tasks.find(t => t.id === id)).filter(Boolean);
  io.emit('tasksReordered', tasks);
  res.sendStatus(200);
});

// ---- BLACKBOARD ROUTES ----
app.get('/api/blackboard', (req, res) => {
  res.json(blackboard);
});

app.post('/api/blackboard', (req, res) => {
  const { message } = req.body;
  blackboard.message = message;
  io.emit('blackboardUpdated', blackboard);
  res.sendStatus(200);
});

// ---- SOCKET.IO CONNECTION ----
io.on('connection', (socket) => {
  console.log('A user connected');
});

// ---- START SERVER ----
const PORT = 3000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
