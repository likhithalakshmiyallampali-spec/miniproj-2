import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Login = ({ setView }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const json = await res.json();
      if (json.success) {
        login(json.data);
        setView('dashboard');
      } else {
        setError(json.message);
      }
    } catch (err) {
      setError('Network communication crash: fallback connection error');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '420px', marginTop: '60px' }}>
      <form onSubmit={handleSubmit} className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: '800' }}>Account Authentication</h2>
        {error && <div style={{ color: '#ef4444', backgroundColor: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>{error}</div>}
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn" style={{ width: '100%', marginTop: '10px' }}>Authenticate Identity</button>
      </form>
    </div>
  );
};

export default Login;