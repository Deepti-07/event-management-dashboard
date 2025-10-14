import Event from '../models/eventModel.js';
import Task from '../models/taskModel.js';

export const createEvent = async (req, res) => {
  try {
    const { name, description, date, location } = req.body;
    if (!name || !description || !date || !location) {
      return res.status(400).json({ message: 'Please enter all fields' });
    }
    const event = new Event({
      name,
      description,
      date,
      location,
    });
    const createdEvent = await event.save();
    res.status(201).json(createdEvent); 
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id); 
    const tasks = await Task.find({ event: req.params.id }).populate('assignedAttendee', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event, tasks });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};



export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      event.name = req.body.name || event.name;
      event.description = req.body.description || event.description;
      event.date = req.body.date || event.date;
      event.location = req.body.location || event.location;
      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};
