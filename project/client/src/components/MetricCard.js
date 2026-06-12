import React from 'react';

const MetricCard = ({ label, value, subtext }) => {
  return (
    <div className="card" style={{ padding: '20px', minHeight: 'auto' }}>
      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{label}</span>
      <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '8px 0 4px 0', color: 'var(--accent-color)' }}>{value}</h1>
      <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{subtext}</span>
    </div>
  );
};

export default MetricCard;