import Attendee from '../models/attendeeModel.js';

export const addAttendee = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Please provide a name and email' });
    }

    const attendeeExists = await Attendee.findOne({ email });

    if (attendeeExists) {
      return res.status(400).json({ message: 'Attendee with this email already exists' });
    }

    const attendee = await Attendee.create({
      name,
      email,
    });

    res.status(201).json(attendee);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getAllAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.find({});
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const deleteAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);

    if (attendee) {
      await attendee.deleteOne();
      res.json({ message: 'Attendee removed' });
    } else {
      res.status(404).json({ message: 'Attendee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};