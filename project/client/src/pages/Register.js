import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Register = ({ setView }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Candidate' });
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        login(json.data);
        setView('dashboard');
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError('Registration transaction failure: fallback communication failure');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '440px', marginTop: '40px' }}>
      <form onSubmit={handleSubmit} className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: '800' }}>Profile Provisioning</h2>
        {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Email ID</label>
          <input type="email" className="form-control" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Password Signature</label>
          <input type="password" className="form-control" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
        </div>
        <div className="form-group">
          <label>Authorization Access Classification</label>
          <select className="form-control" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
            <option value="Candidate">Candidate (Browse and Apply for Roles)</option>
            <option value="Recruiter">Recruiter (Publish and Administer Roles)</option>
          </select>
        </div>
        <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Generate Account Framework</button>
      </form>
    </div>
  );
};

export default Register;