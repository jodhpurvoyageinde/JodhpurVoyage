import mongoose from 'mongoose';

const contactMessageSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    default: 'Demande de renseignements généraux'
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  },
  adminNotes: {
    type: String
  }
}, {
  timestamps: true
});

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
