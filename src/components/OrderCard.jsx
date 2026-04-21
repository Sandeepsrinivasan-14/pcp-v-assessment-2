import React from 'react';

const OrderCard = ({ order }) => {
  const statusClass = `badge badge-${(order.status || '').toLowerCase()}`;

  return (
    <div data-testid="order-item" className="premium-card">
      <div className="premium-card-header">
        <h3>#{order.orderId}</h3>
        <span className={statusClass}>{order.status}</span>
      </div>
      <div className="mb-4">
        <p><strong>Customer:</strong> <span className="text-main">{order.customerName || 'Unknown'}</span></p>
        <p><strong>Restaurant:</strong> <span className="text-main">{order.restaurant}</span></p>
        {order.rating && (
          <p><strong>Rating:</strong> <span className="text-main">{order.rating} ⭐</span></p>
        )}
      </div>
      <div className="mt-auto pt-4 flex justify-between align-center" style={{ borderTop: '1px solid var(--border-color)' }}>
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Total Amount</p>
        <div style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--primary)' }}>
          ₹{order.totalAmount}
        </div>
      </div>
    </div>
  );
};



export default OrderCard;
