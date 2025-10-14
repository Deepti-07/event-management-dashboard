import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Completed'],
    default: 'Pending'
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event'
  },
  assignedAttendee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Attendee'
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;