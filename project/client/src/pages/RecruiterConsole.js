import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import MetricCard from '../components/MetricCard';
import JobCard from '../components/JobCard';

const RecruiterConsole = () => {
  const { user } = useContext(AuthContext);
  const [metrics, setMetrics] = useState({ jobsPosted: 0, totalApplicationsReceived: 0, jobsList: [] });
  const [applicants, setApplicants] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchMetrics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs/recruiter/metrics', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await res.json();
      if (json.success) setMetrics(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = editingId ? `http://localhost:5000/api/jobs/${editingId}` : 'http://localhost:5000/api/jobs';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (json.success) {
        setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' });
        setEditingId(null);
        fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (job) => {
    setEditingId(job._id);
    setForm({ title: job.title, company: job.company, location: job.location, type: job.type, salary: job.salary, description: job.description });
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Confirm structural removal execution path?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await res.json();
      if (json.success) {
        if (selectedJobId === id) setApplicants([]);
        fetchMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewApplications = async (id) => {
    setSelectedJobId(id);
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${id}/applications`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await res.json();
      if (json.success) setApplicants(json.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="metric-grid">
        <MetricCard label="Active Deployments" value={metrics.jobsPosted} subtext="Total published positions" />
        <MetricCard label="Global Applications" value={metrics.totalApplicationsReceived} subtext="Total portfolios stored relationally" />
      </div>

      <form onSubmit={handleFormSubmit} className="card" style={{ marginBottom: '40px' }}>
        <h3 style={{ marginBottom: '20px', fontWeight: '800' }}>{editingId ? 'Modify Strategy Frame Metrics' : 'Deploy Operational Listing Parameter'}</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="form-group"><label>Role Title</label><input type="text" className="form-control" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} required /></div>
          <div className="form-group"><label>Partner Institution</label><input type="text" className="form-control" value={form.company} onChange={(e) => setForm({...form, company: e.target.value})} required /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <div className="form-group"><label>Geographic Node</label><input type="text" className="form-control" value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} required /></div>
          <div className="form-group">
            <label>Classification Type</label>
            <select className="form-control" value={form.type} onChange={(e) => setForm({...form, type: e.target.value})}>
              <option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option><option value="Remote">Remote</option>
            </select>
          </div>
          <div className="form-group"><label>Gross CTC Allocation (INR)</label><input type="number" className="form-control" value={form.salary} onChange={(e) => setForm({...form, salary: e.target.value})} required /></div>
        </div>
        <div className="form-group"><label>Functional Requirements Description</label><textarea className="form-control" rows="4" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} required></textarea></div>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'end' }}>
          {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setForm({ title: '', company: '', location: '', type: 'Full-time', salary: '', description: '' }); }}>Drop Edits</button>}
          <button type="submit" className="btn">{editingId ? 'Push Schema Variations' : 'Publish Core Details'}</button>
        </div>
      </form>

      <h3 style={{ fontWeight: '800', marginBottom: '16px' }}>Live Structural Node Collections</h3>
      {loading ? <div className="spinner"></div> : (
        <div className="grid" style={{ marginBottom: '40px' }}>
          {metrics.jobsList.map(job => (
            <JobCard key={job._id} job={job} isRecruiterView={true} onEdit={handleEditClick} onDelete={handleDeleteClick} onViewApps={handleViewApplications} />
          ))}
        </div>
      )}

      {selectedJobId && (
        <div className="card">
          <h3 style={{ fontWeight: '800', marginBottom: '16px' }}>Relational Applicant Index Data Feed</h3>
          {applicants.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No telemetry pipelines mapped matching individual token indices.</p> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Full Name</th><th>Email Identifier</th><th>Phone Entry</th><th>Registration Date</th></tr>
                </thead>
                <tbody>
                  {applicants.map(app => (
                    <tr key={app._id}><td>{app.fullName}</td><td>{app.email}</td><td>{app.phone}</td><td>{new Date(app.createdAt).toLocaleDateString()}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RecruiterConsole;