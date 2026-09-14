import React from 'react';

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div className="skeleton" style={{ width: '100px', height: '20px' }} />
        <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '999px' }} />
      </div>
      <div className="skeleton" style={{ width: '100%', height: '14px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '80%', height: '14px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '60%', height: '14px', marginBottom: '16px' }} />
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
        <div className="skeleton" style={{ width: '80px', height: '14px' }} />
        <div className="skeleton" style={{ width: '60px', height: '22px' }} />
      </div>
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="stat-card">
      <div className="skeleton" style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '1rem' }} />
      <div className="skeleton" style={{ width: '80px', height: '12px', marginBottom: '6px' }} />
      <div className="skeleton" style={{ width: '60px', height: '36px' }} />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="page-container">
      <div className="skeleton" style={{ width: '200px', height: '32px', marginBottom: '8px' }} />
      <div className="skeleton" style={{ width: '300px', height: '16px', marginBottom: '2rem' }} />
      <div className="stats-grid">
        {[1,2,3,4].map(i => <SkeletonStatCard key={i} />)}
      </div>
      <div className="cards-grid">
        {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
      </div>
    </div>
  );
}
