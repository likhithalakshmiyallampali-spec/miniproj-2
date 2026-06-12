import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const JobCard = ({ job, isRecruiterView, onEdit, onDelete, onApply, onViewApps, isSaved, onToggleSave }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="badge" style={{ marginRight: 'auto' }}>{job.type}</span>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '500' }}>{job.location}</span>
      </div>
      <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>{job.title}</h3>
      <h4 style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px', fontWeight: '500' }}>{job.company}</h4>
      <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px', flexGrow: 1, lineHeight: '1.5' }}>{job.description}</p>
      
      <div style={{ paddingTop: '16px', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '700' }}>CTC Allocation</div>
          <span style={{ fontSize: '16px', fontWeight: '700' }}>₹{job.salary.toLocaleString('en-IN')}</span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {isRecruiterView ? (
            <>
              <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => onEdit(job)}>Edit</button>
              <button className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => onDelete(job._id)}>Delete</button>
              <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '12px' }} onClick={() => onViewApps(job._id)}>Applications</button>
            </>
          ) : (
            <>
              {user && user.role === 'Candidate' && (
                <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => onToggleSave(job._id)}>
                  {isSaved ? 'Unsave' : 'Save'}
                </button>
              )}
              {(!user || user.role === 'Candidate') && (
                <button className="btn" style={{ padding: '8px 14px' }} onClick={() => onApply(job)}>Apply</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobCard;