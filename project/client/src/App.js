import React, { useState, useContext } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import RecruiterConsole from './pages/RecruiterConsole';
import CandidateConsole from './pages/CandidateConsole';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const [view, setView] = useState('dashboard');
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [applicantForm, setApplicantForm] = useState({ fullName: '', email: '', phone: '' });
  const { user } = useContext(AuthContext);

  const handleApplyClick = (job) => {
    if (!user) {
      setView('login');
      return;
    }
    setApplyModalJob(job);
    setApplicantForm({ fullName: user.name, email: user.email, phone: '' });
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/applications/${applyModalJob._id}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify(applicantForm)
      });
      const json = await res.json();
      if (json.success) {
        alert('Application packet routed successfully.');
        setApplyModalJob(null);
      } else {
        alert(json.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar currentView={view} setView={setView} />
      
      {view === 'dashboard' && <Dashboard onApplyAction={handleApplyClick} />}
      {view === 'login' && <Login setView={setView} />}
      {view === 'register' && <Register setView={setView} />}
      
      {view === 'recruiter' && (
        <ProtectedRoute allowedRoles={['Recruiter']}>
          <RecruiterConsole />
        </ProtectedRoute>
      )}
      
      {view === 'candidate' && (
        <ProtectedRoute allowedRoles={['Candidate']}>
          <CandidateConsole />
        </ProtectedRoute>
      )}

      {applyModalJob && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h3 style={{ fontWeight: '800', marginBottom: '8px' }}>Application Setup: {applyModalJob.title}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '14px' }}>{applyModalJob.company} - {applyModalJob.location}</p>
            <form onSubmit={handleModalSubmit}>
              <div className="form-group">
                <label>Applicant Name</label>
                <input type="text" className="form-control" value={applicantForm.fullName} onChange={(e) => setApplicantForm({...applicantForm, fullName: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Routing Email</label>
                <input type="email" className="form-control" value={applicantForm.email} onChange={(e) => setApplicantForm({...applicantForm, email: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Telephone Entry</label>
                <input type="tel" className="form-control" value={applicantForm.phone} onChange={(e) => setApplicantForm({...applicantForm, phone: e.target.value})} required />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'end', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setApplyModalJob(null)}>Dismiss</button>
                <button type="submit" className="btn">Route Portfolio Package</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;