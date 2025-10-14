import Task from '../models/taskModel.js';
import Event from '../models/eventModel.js';
import { io } from '../server.js';

export const createTask = async (req, res) => {
  try {
    const { name, deadline, event: eventId, assignedAttendee } = req.body;
    if (!name || !deadline || !eventId) {
      return res.status(400).json({ message: 'Please provide name, deadline, and event ID' });
    }
    const eventExists = await Event.findById(eventId);
    if (!eventExists) {
      return res.status(404).json({ message: 'Event not found' });
    }
    const task = await Task.create({
      name,
      deadline,
      event: eventId,
      assignedAttendee,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getTasksForEvent = async (req, res) => {
  try {
    const tasks = await Task.find({ event: req.params.id }).populate('assignedAttendee', 'name email');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (task) {
      task.status = status;
      const updatedTask = await task.save();
      
      await updatedTask.populate('assignedAttendee', 'name email');

      io.emit('taskUpdated', updatedTask);

      res.json(updatedTask);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};