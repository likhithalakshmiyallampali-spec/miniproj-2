import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = ({ currentView, setView }) => {
  const { user, logout } = useContext(AuthContext);

  const toggleTheme = () => {
    const root = document.documentElement;
    const currentTheme = root.getAttribute('data-theme');
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', nextTheme);
  };

  return (
    <nav className="navbar">
      <h2 style={{ cursor: 'pointer', fontWeight: '800' }} onClick={() => setView('dashboard')}>JobPortalPro</h2>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <button className="btn btn-secondary" onClick={toggleTheme}>Toggle Mode</button>
        {user ? (
          <>
            <span style={{ fontSize: '14px', fontWeight: '600' }}>{user.name} ({user.role})</span>
            {user.role === 'Recruiter' ? (
              <button className="btn btn-secondary" onClick={() => setView('recruiter')}>Recruiter Console</button>
            ) : (
              <button className="btn btn-secondary" onClick={() => setView('candidate')}>My Workspace</button>
            )}
            <button className="btn btn-danger" onClick={() => { logout(); setView('dashboard'); }}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => setView('login')}>Sign In</button>
            <button className="btn" onClick={() => setView('register')}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;