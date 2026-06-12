import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="spinner"></div>;

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2>Access Rejected</h2>
        <p style={{ margin: '15px 0', color: 'var(--text-secondary)' }}>You must be authenticated to view this workspace destination.</p>
        <a href="/login" className="btn" style={{ textDecoration: 'none' }}>Proceed to Login</a>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '60px' }}>
        <h2>Clearance Error</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Your profile role parameters lack authorization permissions for this page link node.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;