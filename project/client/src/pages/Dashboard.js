import React, { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import JobCard from '../components/JobCard';

const Dashboard = ({ onApplyAction }) => {
  const { user, syncSavedJobs } = useContext(AuthContext);
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', type: 'All', location: '', minSalary: '', maxSalary: '', sort: 'latest' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const { search, type, location, minSalary, maxSalary, sort } = filters;
      const uri = `http://localhost:5000/api/jobs?search=${search}&type=${type}&location=${location}&minSalary=${minSalary}&maxSalary=${maxSalary}&sort=${sort}&page=${page}&limit=6`;
      const res = await fetch(uri);
      const json = await res.json();
      if (json.success) {
        setJobs(json.data);
        setTotalPages(json.totalPages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setPage(1);
  };

  const handleToggleSave = async (jobId) => {
    if (!user) return;
    const isCurrentlySaved = user.savedJobs && user.savedJobs.some(id => id === jobId || id._id === jobId);
    const url = `http://localhost:5000/api/jobs/${jobId}/save`;
    const method = isCurrentlySaved ? 'DELETE' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const json = await res.json();
      if (json.success) {
        let updated;
        if (isCurrentlySaved) {
          updated = user.savedJobs.filter(id => (id._id || id) !== jobId);
        } else {
          updated = [...user.savedJobs, jobId];
        }
        syncSavedJobs(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ padding: '24px', marginBottom: '30px' }}>
        <h3 style={{ marginBottom: '16px', fontWeight: '800' }}>Search Matrix Filters</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <input type="text" name="search" placeholder="Position or organization keywords..." className="form-control" value={filters.search} onChange={handleFilterChange} />
          <input type="text" name="location" placeholder="Geographic city index node..." className="form-control" value={filters.location} onChange={handleFilterChange} />
          <select name="type" className="form-control" value={filters.type} onChange={handleFilterChange}>
            <option value="All">All Structural Allocations</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Remote">Remote</option>
          </select>
          <input type="number" name="minSalary" placeholder="Minimum Gross Salary (INR)" className="form-control" value={filters.minSalary} onChange={handleFilterChange} />
          <input type="number" name="maxSalary" placeholder="Maximum Gross Salary (INR)" className="form-control" value={filters.maxSalary} onChange={handleFilterChange} />
          <select name="sort" className="form-control" value={filters.sort} onChange={handleFilterChange}>
            <option value="latest">Sort: Fresh Placements</option>
            <option value="oldest">Sort: Historical Records</option>
            <option value="salary_asc">CTC: Low to High</option>
            <option value="salary_desc">CTC: High to Low</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          <h3>Zero Matches Discovered</h3>
          <p>No operational position files correspond to your parameters.</p>
        </div>
      ) : (
        <>
          <div className="grid">
            {jobs.map(job => {
              const isSaved = user && user.savedJobs && user.savedJobs.some(id => id === job._id || id._id === job._id);
              return (
                <JobCard key={job._id} job={job} isRecruiterView={false} onApply={onApplyAction} isSaved={isSaved} onToggleSave={handleToggleSave} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginTop: '40px' }}>
            <button className="btn btn-secondary" disabled={page === 1} onClick={() => setPage(p => p - 1)}>Previous Sequence</button>
            <span style={{ fontWeight: '600', fontSize: '14px' }}>Segment {page} of {totalPages}</span>
            <button className="btn btn-secondary" disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>Next Sequence</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;