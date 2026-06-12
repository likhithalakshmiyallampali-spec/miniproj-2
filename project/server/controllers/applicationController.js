const Application = require('../models/Application');
const Job = require('../models/Job');

exports.submitCandidateApplication = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    if (!fullName || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Functional transactional requirement error: telemetry structure fields missing elements' });
    }
    const targetJob = await Job.findById(req.params.id);
    if (!targetJob) {
      return res.status(404).json({ success: false, message: 'Target mapping profile node non-existent' });
    }

    const applicationExist = await Application.findOne({ jobId: req.params.id, candidateId: req.user.id });
    if (applicationExist) {
      return res.status(400).json({ success: false, message: 'Transaction blocked: Candidate portfolio duplication detected for role' });
    }

    const application = await Application.create({
      jobId: req.params.id,
      candidateId: req.user.id,
      fullName,
      email,
      phone
    });
    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getApplicationsByListing = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Parent target index reference structural location error' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Privilege validation warning: access to secondary account dataset rejected' });
    }
    const applicants = await Application.find({ jobId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCandidateApplications = async (req, res) => {
  try {
    const userApplications = await Application.find({ candidateId: req.user.id }).populate({
      path: 'jobId',
      select: 'title company location type salary'
    }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: userApplications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};