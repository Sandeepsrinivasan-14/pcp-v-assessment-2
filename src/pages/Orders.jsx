import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import OrderCard from '../components/OrderCard';
import { getValidOrders } from '../services/utils';

const Orders = () => {
  const { state, dispatch } = useContext(AppContext);
  const validOrders = getValidOrders(state.orders);
  const pendingOrders = validOrders.filter(
    (order) => order.status && order.status.toLowerCase() === 'pending'
  );

  const handleMarkDelivered = (orderId) => {
    const order = state.orders.find((o) => o.orderId === orderId);
    if (order && order.status !== 'delivered') {
      dispatch({
        type: 'UPDATE_ORDER_STATUS',
        payload: { orderId, status: 'delivered' },
      });
    }
  };

  if (state.loading) {
    return (
      <div className="page-container text-center" style={{ paddingTop: '4rem' }}>
        <h1 className="mb-4">Loading orders...</h1>
        <p className="text-muted">Authenticating and fetching data...</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="page-container">
        <h1>❌ Error</h1>
        <div className="info-box" style={{ borderColor: 'var(--danger)', backgroundColor: 'var(--danger-bg)' }}>
          <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>{state.error}</p>
          <p className="text-muted mt-4 text-sm">
            Check the browser console (F12) for more details.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="flex justify-between align-center mb-4">
        <h1>Pending Orders</h1>
        <div className="badge badge-pending" style={{ fontSize: '1rem', padding: '8px 16px' }}>
          {pendingOrders.length} Pending
        </div>
      </div>
      
      {pendingOrders.length === 0 ? (
        <div className="info-box text-center mt-6">
          <p className="text-muted">No pending orders found. You're all caught up!</p>
        </div>
      ) : (
        <div className="cards-grid">
          {pendingOrders.map((order) => (
            <div key={order.orderId} style={{ display: 'flex', flexDirection: 'column' }}>
              <Link to={`/orders/${order.orderId}`} style={{ textDecoration: 'none', color: 'inherit', flex: 1 }}>
                <OrderCard order={order} />
              </Link>
              <button
                onClick={() => handleMarkDelivered(order.orderId)}
                className={`btn mt-4 ${order.status === 'delivered' ? 'btn-success' : 'btn-primary'}`}
                style={{ width: '100%' }}
                disabled={order.status === 'delivered'}
              >
                {order.status === 'delivered'
                  ? 'Delivered'
                  : 'Mark as Delivered'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
