import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { isValidOrder, calculateItemSubtotal } from '../services/utils';

const OrderDetail = () => {
  const { state } = useContext(AppContext);
  const { id } = useParams();

  const order = state.orders.find((o) => o.orderId === parseInt(id));

  if (!order) {
    return (
      <div className="page-container text-center py-8">
        <h1>Order not found</h1>
        <Link to="/orders" className="btn btn-primary mt-4">← Back to Orders</Link>
      </div>
    );
  }

  if (!isValidOrder(order)) {
    return (
      <div className="page-container text-center py-8">
        <div className="info-box border-danger bg-danger-light inline-block">
          <h1 className="text-danger">Invalid Order</h1>
          <p className="text-muted">This order has corrupted data and cannot be displayed.</p>
        </div>
        <br />
        <Link to="/orders" className="btn btn-primary mt-4">← Back to Orders</Link>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ maxWidth: '800px' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', color: 'var(--primary)', fontWeight: 600, marginBottom: '1.5rem' }}>
        ← Back to Orders
      </Link>
      
      <div className="premium-card" style={{ padding: '2rem' }}>
        <div className="premium-card-header mb-6" style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>Order <span style={{ color: 'var(--primary)' }}>#{order.orderId}</span></h1>
            <p className="text-muted mt-2">Placed at {order.restaurant}</p>
          </div>
          <span className={`badge badge-${(order.status || '').toLowerCase()}`} style={{ fontSize: '1rem', padding: '8px 16px' }}>
            {order.status}
          </span>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="info-box" style={{ flex: 1 }}>
            <p className="text-muted text-sm text-uppercase">Customer</p>
            <p className="text-main" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{order.customerName || 'Unknown'}</p>
          </div>
          {order.deliveryTime && (
            <div className="info-box" style={{ flex: 1 }}>
              <p className="text-muted text-sm text-uppercase">Delivery Time</p>
              <p className="text-main" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{order.deliveryTime}</p>
            </div>
          )}
          {order.rating && (
            <div className="info-box" style={{ flex: 1 }}>
              <p className="text-muted text-sm text-uppercase">Rating</p>
              <p className="text-main" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{order.rating} ⭐</p>
            </div>
          )}
        </div>

        <div className="table-container mb-6">
          {order.items && order.items.length > 0 ? (
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Item Description</th>
                  <th className="text-right">Price</th>
                  <th className="text-right">Qty</th>
                  <th className="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{item.name}</td>
                    <td className="text-right text-muted">₹{item.price}</td>
                    <td className="text-right text-muted">x{item.quantity}</td>
                    <td className="text-right" style={{ fontWeight: 600 }}>₹{calculateItemSubtotal(item)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center p-4 text-muted">No items found in this order.</p>
          )}
        </div>

        <div className="flex justify-between align-center" style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
          <h3 className="text-muted m-0">Total Amount</h3>
          <h1 style={{ color: 'var(--primary)', margin: 0 }}>₹{order.totalAmount}</h1>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
