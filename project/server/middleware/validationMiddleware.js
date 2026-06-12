exports.validateRegistration = (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ success: false, message: 'Structural integrity failure: mandatory fields missing properties' });
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Malformed data argument validation exception: email invalid' });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: 'Security parameter threshold error: password configuration below 6 characters' });
  }
  if (role !== 'Candidate' && role !== 'Recruiter') {
    return res.status(400).json({ success: false, message: 'Role domain categorization anomaly detected' });
  }
  next();
};

exports.validateJobInput = (req, res, next) => {
  const { title, company, location, type, salary, description } = req.body;
  if (!title || !company || !location || !type || !salary || !description) {
    return res.status(400).json({ success: false, message: 'Missing structural properties in validation scope assignment' });
  }
  if (isNaN(salary) || Number(salary) < 0) {
    return res.status(400).json({ success: false, message: 'Compensation formatting constraints require positive numeric values' });
  }
  next();
};