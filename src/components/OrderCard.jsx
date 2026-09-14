import React, { useRef } from 'react';

const STATUS_META = {
  pending:   { emoji: '⏳', label: 'Pending' },
  delivered: { emoji: '✅', label: 'Delivered' },
  cancelled: { emoji: '❌', label: 'Cancelled' },
};

const OrderCard = ({ order }) => {
  const cardRef = useRef(null);
  const status = (order.status || '').toLowerCase();
  const meta = STATUS_META[status] || { emoji: '📦', label: order.status };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(8px)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current)
      cardRef.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  };

  const initials = (order.customerName || 'U').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      data-testid="order-item"
      className="premium-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="premium-card-header">
        <div className="flex items-center gap-2">
          <div className="avatar avatar-gradient" style={{ width: 32, height: 32, fontSize: '0.75rem' }}>{initials}</div>
          <span style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.9375rem' }}>#{order.orderId}</span>
        </div>
        <span className={`badge badge-${status}`}>
          {meta.emoji} {meta.label}
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '0.75rem' }}>👤</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Customer</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginLeft: 'auto' }}>
            {order.customerName || 'Unknown'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
          <span style={{ fontSize: '0.75rem' }}>🏪</span>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Restaurant</span>
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginLeft: 'auto', textAlign: 'right', maxWidth: 130, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {order.restaurant}
          </span>
        </div>
        {order.items && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem' }}>🛒</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Items</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text)', marginLeft: 'auto' }}>
              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {order.rating && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
            <span style={{ fontSize: '0.75rem' }}>⭐</span>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Rating</span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--warning)', marginLeft: 'auto' }}>
              {'★'.repeat(Math.round(order.rating))} {order.rating}
            </span>
          </div>
        )}
      </div>

      <div
        className="mt-auto pt-4"
        style={{
          borderTop: '1px solid var(--border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '1rem',
          paddingTop: '0.75rem',
        }}
      >
        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
          Total
        </span>
        <span style={{
          fontSize: '1.375rem',
          fontWeight: 900,
          background: 'linear-gradient(135deg, var(--primary-light), var(--accent))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontFamily: 'var(--font-display)',
        }}>
          ₹{order.totalAmount?.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default OrderCard;
