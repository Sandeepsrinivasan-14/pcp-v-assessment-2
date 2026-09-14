import React from 'react';

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);

  if (left > 1) { pages.push(1); if (left > 2) pages.push('...'); }
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages) { if (right < totalPages - 1) pages.push('...'); pages.push(totalPages); }

  const btn = (label, target, disabled = false) => (
    <button
      key={label}
      onClick={() => !disabled && target !== '...' && onChange(target)}
      disabled={disabled || target === '...'}
      style={{
        minWidth: 36, height: 36,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-sm)',
        border: `1px solid ${target === page ? 'var(--primary-light)' : 'var(--border)'}`,
        background: target === page
          ? 'linear-gradient(135deg, var(--primary-light), var(--primary-dark))'
          : 'var(--surface)',
        color: target === page ? '#fff' : disabled ? 'var(--text-subtle)' : 'var(--text-muted)',
        fontWeight: target === page ? 700 : 500,
        fontSize: '0.875rem',
        cursor: disabled || target === '...' ? 'default' : 'pointer',
        transition: 'var(--transition)',
        fontFamily: 'var(--font-main)',
        boxShadow: target === page ? 'var(--shadow-glow)' : 'none',
        padding: '0 0.5rem',
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', marginTop: '2rem', flexWrap: 'wrap' }}>
      {btn('←', page - 1, page === 1)}
      {pages.map((p, i) => btn(p, p))}
      {btn('→', page + 1, page === totalPages)}
    </div>
  );
}
