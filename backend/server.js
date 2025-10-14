import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';

import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from './controllers/eventController.js';

import {
  addAttendee,
  getAllAttendees,
  deleteAttendee
} from './controllers/attendeeController.js';

import {
  createTask,
  getTasksForEvent,
  updateTaskStatus
} from './controllers/taskController.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Event Management Dashboard API is running...');
});

app.get('/api/events', getAllEvents);
app.post('/api/events', createEvent);
app.get('/api/events/:id', getEventById);
app.put('/api/events/:id', updateEvent);
app.delete('/api/events/:id', deleteEvent);

app.get('/api/attendees', getAllAttendees);
app.post('/api/attendees', addAttendee);
app.delete('/api/attendees/:id', deleteAttendee);

app.post('/api/tasks', createTask);
app.get('/api/events/:id/tasks', getTasksForEvent);
app.patch('/api/tasks/:id', updateTaskStatus);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io };
