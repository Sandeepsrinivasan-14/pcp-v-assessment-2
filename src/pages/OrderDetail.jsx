import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { isValidOrder, calculateItemSubtotal } from '../services/utils';
import { useToast } from '../context/ToastContext';

const STATUS_STEPS = ['Order Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
const CANCELLED_STEPS = ['Order Placed', 'Confirmed', 'Cancelled'];

const OrderDetail = () => {
  const { state, dispatch } = useContext(AppContext);
  const { addToast } = useToast();
  const { id } = useParams();
  const order = state.orders.find(o => o.orderId === parseInt(id));

  const handleMarkDelivered = () => {
    if (order?.status?.toLowerCase() !== 'delivered') {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId: order.orderId, status: 'delivered' } });
      addToast(`Order #${order.orderId} marked as delivered! ✅`, 'success');
    }
  };

  if (!order) return (
    <div className="page-container text-center" style={{ paddingTop: '4rem' }}>
      <span style={{ fontSize: '4rem' }}>📭</span>
      <h2 style={{ marginTop: '1rem' }}>Order not found</h2>
      <Link to="/orders" className="btn btn-primary mt-4">← Back to Orders</Link>
    </div>
  );

  if (!isValidOrder(order)) return (
    <div className="page-container text-center" style={{ paddingTop: '4rem' }}>
      <span style={{ fontSize: '4rem' }}>⚠️</span>
      <h2 style={{ marginTop: '1rem' }}>Invalid Order</h2>
      <p className="text-muted mt-2">This order has corrupted or incomplete data.</p>
      <Link to="/orders" className="btn btn-primary mt-4">← Back to Orders</Link>
    </div>
  );

  const status = (order.status || '').toLowerCase();
  const steps = status === 'cancelled' ? CANCELLED_STEPS : STATUS_STEPS;
  const stepIndex = status === 'delivered' ? steps.length - 1
    : status === 'cancelled' ? steps.length - 1
    : status === 'pending' ? 1
    : 2;

  const subtotal = order.items?.reduce((s, item) => s + calculateItemSubtotal(item), 0) || 0;

  return (
    <div className="page-container animate-in" style={{ maxWidth: '880px' }}>
      <Link to="/orders" className="back-link">
        ← Back to Orders
      </Link>

      {/* Header */}
      <div className="glass-card p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 style={{ marginBottom: '0.25rem' }}>
              Order <span className="gradient-text">#{order.orderId}</span>
            </h1>
            <p className="text-muted">{order.restaurant}</p>
          </div>
          <span className={`badge badge-${status}`} style={{ fontSize: '0.875rem', padding: '8px 16px' }}>
            {status === 'delivered' ? '✅' : status === 'cancelled' ? '❌' : '⏳'} {order.status}
          </span>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid-3 mb-6">
        <div className="glass-card p-4">
          <div className="text-xs text-muted text-uppercase mb-1" style={{ letterSpacing: '0.07em', fontWeight: 700 }}>Customer</div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>👤 {order.customerName || 'Unknown'}</div>
        </div>
        {order.deliveryTime && (
          <div className="glass-card p-4">
            <div className="text-xs text-muted text-uppercase mb-1" style={{ letterSpacing: '0.07em', fontWeight: 700 }}>Delivery Time</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>⏱️ {order.deliveryTime}</div>
          </div>
        )}
        {order.rating && (
          <div className="glass-card p-4">
            <div className="text-xs text-muted text-uppercase mb-1" style={{ letterSpacing: '0.07em', fontWeight: 700 }}>Rating</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--warning)' }}>
              {'★'.repeat(Math.round(order.rating))} {order.rating}/5
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="glass-card p-6 mb-6">
        <h3 className="mb-4">📍 Order Timeline</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexWrap: 'wrap' }}>
          {steps.map((step, i) => {
            const done = i <= stepIndex;
            const isLast = status === 'cancelled' && i === steps.length - 1;
            return (
              <React.Fragment key={i}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.375rem', flex: '0 0 auto' }}>
                  <div style={{
                    width: 36, height: 36,
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isLast ? 'var(--danger-bg)'
                      : done ? 'linear-gradient(135deg, var(--primary-light), var(--accent))'
                      : 'var(--bg-secondary)',
                    border: `2px solid ${isLast ? 'var(--danger)' : done ? 'transparent' : 'var(--border)'}`,
                    color: isLast ? 'var(--danger)' : done ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    transition: 'all 0.3s',
                    boxShadow: done && !isLast ? 'var(--shadow-glow)' : 'none',
                  }}>
                    {isLast ? '✕' : done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: '0.65rem', color: done ? 'var(--text)' : 'var(--text-subtle)', fontWeight: done ? 600 : 400, textAlign: 'center', maxWidth: 70, lineHeight: 1.2 }}>
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    flex: 1, height: 2, minWidth: 20,
                    background: i < stepIndex ? 'linear-gradient(90deg, var(--primary-light), var(--accent))' : 'var(--border)',
                    borderRadius: '2px',
                    marginBottom: '18px',
                    transition: 'background 0.3s',
                  }} />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Items Table */}
      <div className="glass-card p-6 mb-6">
        <h3 className="mb-4">🛒 Order Items</h3>
        {order.items?.length > 0 ? (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{item.name}</td>
                    <td className="text-right text-muted">₹{item.price?.toLocaleString()}</td>
                    <td className="text-right">
                      <span className="badge badge-info">×{item.quantity}</span>
                    </td>
                    <td className="text-right" style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                      ₹{calculateItemSubtotal(item).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-muted text-center p-4">No items in this order</p>
        )}
      </div>

      {/* Total */}
      <div className="glass-card p-6 mb-6">
        <div className="metric-row">
          <span className="text-muted font-semibold">Subtotal</span>
          <span style={{ fontWeight: 600 }}>₹{subtotal.toLocaleString()}</span>
        </div>
        <div className="metric-row">
          <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text)' }}>Total Amount</span>
          <span style={{ fontSize: '1.75rem', fontWeight: 900, fontFamily: 'var(--font-display)' }} className="gradient-text">
            ₹{order.totalAmount?.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Action */}
      {status === 'pending' && (
        <button onClick={handleMarkDelivered} className="btn btn-success btn-lg w-full" style={{ width: '100%', justifyContent: 'center' }}>
          ✅ Mark as Delivered
        </button>
      )}
    </div>
  );
};

export default OrderDetail;
