const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

exports.getAllJobs = async (req, res) => {
  try {
    const { search, type, location, minSalary, maxSalary, sort, page = 1, limit = 6 } = req.query;
    const queryObject = {};

    if (search) {
      queryObject.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }
    if (type && type !== 'All') queryObject.type = type;
    if (location) queryObject.location = { $regex: location, $options: 'i' };
    
    if (minSalary || maxSalary) {
      queryObject.salary = {};
      if (minSalary) queryObject.salary.$gte = Number(minSalary);
      if (maxSalary) queryObject.salary.$lte = Number(maxSalary);
    }

    let sortCriteria = { createdAt: -1 };
    if (sort === 'salary_asc') sortCriteria = { salary: 1 };
    if (sort === 'salary_desc') sortCriteria = { salary: -1 };
    if (sort === 'oldest') sortCriteria = { createdAt: 1 };

    const skipIndex = (parseInt(page) - 1) * parseInt(limit);
    const totalCount = await Job.countDocuments(queryObject);
    const listings = await Job.find(queryObject).sort(sortCriteria).limit(parseInt(limit)).skip(skipIndex).populate('postedBy', 'name email');

    res.status(200).json({
      success: true,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: parseInt(page),
      data: listings
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRecruiterMetrics = async (req, res) => {
  try {
    const jobs = await Job.find({ postedBy: req.user.id });
    const jobIds = jobs.map(j => j._id);
    const applicationsCount = await Application.countDocuments({ jobId: { $in: jobIds } });
    
    res.status(200).json({
      success: true,
      data: {
        jobsPosted: jobs.length,
        totalApplicationsReceived: applicationsCount,
        jobsList: jobs
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createJobPosting = async (req, res) => {
  try {
    const { title, company, location, type, salary, description } = req.body;
    const newJob = await Job.create({
      title, company, location, type, salary: Number(salary), description, postedBy: req.user.id
    });
    res.status(201).json({ success: true, data: newJob });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateJobPosting = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Record reference point missing execution matching target' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Authorization modification check failure: reference ownership mismatch' });
    }
    job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, data: job });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteJobPosting = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Record reference point missing execution matching target' });
    }
    if (job.postedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Authorization drop execution failure: signature footprint verification dropped' });
    }
    await Job.findByIdAndDelete(req.params.id);
    await Application.deleteMany({ jobId: req.params.id });
    res.status(200).json({ success: true, message: 'Target node references completely expunged' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.saveJobAction = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.savedJobs.includes(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Database relation tracking parameter duplication error' });
    }
    user.savedJobs.push(req.params.id);
    await user.save();
    res.status(200).json({ success: true, message: 'Job pointer correctly cataloged in context collection' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeSavedJobAction = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.status(200).json({ success: true, message: 'Job pointer correctly discarded from context allocation map' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};