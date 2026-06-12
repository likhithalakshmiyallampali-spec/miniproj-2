const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name data field is mandatory']
  },
  email: {
    type: String,
    required: [true, 'Email reference is mandatory'],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Invalid email formatting schema']
  },
  password: {
    type: String,
    required: [true, 'Security credential token payload string is mandatory']
  },
  role: {
    type: String,
    enum: ['Candidate', 'Recruiter'],
    required: [true, 'Structural authorization classification role is mandatory']
  },
  savedJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);