const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title string assignment is mandatory']
  },
  company: {
    type: String,
    required: [true, 'Corporate partner identifier name is mandatory']
  },
  location: {
    type: String,
    required: [true, 'Geographic location marker parameter is mandatory']
  },
  type: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Remote'],
    required: [true, 'Operational commitment type mapping is mandatory']
  },
  salary: {
    type: Number,
    required: [true, 'Financial allocation parameter input is mandatory'],
    min: [0, 'Compensation metrics cannot assume negative evaluations']
  },
  description: {
    type: String,
    required: [true, 'Functional role scope narrative content is mandatory']
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Originator validation reference ownership map is mandatory']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', JobSchema);