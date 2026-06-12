const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: [true, 'Parent vacancy mapping identifier is mandatory']
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Applicant credential origin reference is mandatory']
  },
  fullName: {
    type: String,
    required: [true, 'Applicant name specification string is mandatory']
  },
  email: {
    type: String,
    required: [true, 'Communication channel route tracking string is mandatory']
  },
  phone: {
    type: String,
    required: [true, 'Telephone network pointer quantification is mandatory']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', ApplicationSchema);