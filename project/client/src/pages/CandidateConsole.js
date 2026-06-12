import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const CandidateConsole = () => {
  const { user, syncSavedJobs } = useContext(AuthContext);
  const [history, setHistory] = useState([]);
  const [savedDetails, setSavedDetails] = useState([]);
  const [activeTab, setActiveTab] = useState('applied');
  const [loading, setLoading] = useState(true);

  const fetchHistoryAndSaved = useCallback(async () => {
    setLoading(true);
    try {
      const resHist = await fetch('http://localhost:5000/api/applications/candidate/history', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const jsonHist = await resHist.json();
      if (jsonHist.success) setHistory(jsonHist.data);

      const resProf = await fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const jsonProf = await resProf.json();
      if (jsonProf.success) {
        setSavedDetails(jsonProf.data.savedJobs || []);
        syncSavedJobs(jsonProf.data.savedJobs.map(j => j._id || j));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user.token]);

  useEffect(() => {
    fetchHistoryAndSaved();
  }, [fetchHistoryAndSaved]);

  const handleUnsave = async (jobId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/save`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await res.json();
      if (json.success) {
        const remaining = savedDetails.filter(j => j._id !== jobId);
        setSavedDetails(remaining);
        syncSavedJobs(remaining.map(j => j._id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button className={`btn ${activeTab === 'applied' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('applied')}>Transmission History</button>
        <button className={`btn ${activeTab === 'saved' ? '' : 'btn-secondary'}`} onClick={() => setActiveTab('saved')}>Bookmarked Positions</button>
      </div>

      {loading ? <div className="spinner"></div> : activeTab === 'applied' ? (
        <div className="card">
          <h3 style={{ fontWeight: '800', marginBottom: '16px' }}>Submitted Application Logs</h3>
          {history.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No transmission pipelines verified in server archives.</p> : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr><th>Role Title</th><th>Partner Company</th><th>Geographic Location</th><th>CTC Valuation</th><th>Timestamp</th></tr>
                </thead>
                <tbody>
                  {history.map(app => (
                    <tr key={app._id}>
                      <td>{app.jobId?.title || 'Data Expunged'}</td>
                      <td>{app.jobId?.company || 'N/A'}</td>
                      <td>{app.jobId?.location || 'N/A'}</td>
                      <td>{app.jobId ? `₹${app.jobId.salary.toLocaleString('en-IN')}` : 'N/A'}</td>
                      <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h3 style={{ fontWeight: '800', marginBottom: '16px' }}>Saved Workspace Placements</h3>
          {savedDetails.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No tokens active in local bookmark registers.</p> : (
            <div className="grid">
              {savedDetails.map(job => (
                <JobCard key={job._id} job={job} isRecruiterView={false} isSaved={true} onToggleSave={handleUnsave} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CandidateConsole;