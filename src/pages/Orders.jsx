import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import OrderCard from '../components/OrderCard';
import { getValidOrders } from '../services/utils';
import { useToast } from '../context/ToastContext';
import { SkeletonPage } from '../components/Skeleton';

const STATUS_TABS = ['All', 'Pending', 'Delivered', 'Cancelled'];
const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'amount_desc', label: 'Amount: High → Low' },
  { value: 'amount_asc', label: 'Amount: Low → High' },
  { value: 'name_asc', label: 'Customer A → Z' },
  { value: 'restaurant_asc', label: 'Restaurant A → Z' },
  { value: 'rating_desc', label: 'Rating: Best first' },
];

const Orders = () => {
  const { state, dispatch } = useContext(AppContext);
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('Pending');
  const [sort, setSort] = useState('default');

  const validOrders = useMemo(() => getValidOrders(state.orders), [state.orders]);

  const filtered = useMemo(() => {
    let list = validOrders;
    if (statusTab !== 'All')
      list = list.filter(o => o.status?.toLowerCase() === statusTab.toLowerCase());
    if (search.trim())
      list = list.filter(o =>
        o.customerName?.toLowerCase().includes(search.toLowerCase()) ||
        o.restaurant?.toLowerCase().includes(search.toLowerCase()) ||
        String(o.orderId).includes(search)
      );
    if (sort === 'amount_desc') list = [...list].sort((a, b) => b.totalAmount - a.totalAmount);
    else if (sort === 'amount_asc') list = [...list].sort((a, b) => a.totalAmount - b.totalAmount);
    else if (sort === 'name_asc') list = [...list].sort((a, b) => (a.customerName || '').localeCompare(b.customerName || ''));
    else if (sort === 'restaurant_asc') list = [...list].sort((a, b) => (a.restaurant || '').localeCompare(b.restaurant || ''));
    else if (sort === 'rating_desc') list = [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0));
    return list;
  }, [validOrders, statusTab, search, sort]);

  const counts = useMemo(() => ({
    All: validOrders.length,
    Pending: validOrders.filter(o => o.status?.toLowerCase() === 'pending').length,
    Delivered: validOrders.filter(o => o.status?.toLowerCase() === 'delivered').length,
    Cancelled: validOrders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
  }), [validOrders]);

  const handleMarkDelivered = (orderId) => {
    const order = state.orders.find(o => o.orderId === orderId);
    if (order && order.status?.toLowerCase() !== 'delivered') {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: 'delivered' } });
      addToast(`Order #${orderId} marked as delivered! ✅`, 'success');
    }
  };

  if (state.loading) return <SkeletonPage />;

  if (state.error) return (
    <div className="page-container">
      <div className="info-box" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)' }}>
        <h3 style={{ color: 'var(--danger)' }}>❌ Error</h3>
        <p style={{ color: 'var(--danger)', marginTop: '0.5rem' }}>{state.error}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>📦 Orders</h1>
        <p>Manage and track all food delivery orders</p>
      </div>

      {/* Filter bar */}
      <div className="filter-bar animate-in animate-in-delay-1">
        <div className="filter-tabs">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              className={`filter-tab${statusTab === tab ? ' active' : ''}`}
              onClick={() => setStatusTab(tab)}
            >
              {tab}
              <span style={{
                marginLeft: '4px',
                background: statusTab === tab ? 'rgba(109,40,217,0.12)' : 'var(--border)',
                color: statusTab === tab ? 'var(--primary-light)' : 'var(--text-muted)',
                padding: '1px 6px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Search by name, restaurant, or ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="premium-input"
          style={{ flex: 1, minWidth: 200 }}
        />

        <div className="select-wrapper" style={{ minWidth: 180 }}>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="premium-select"
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between mb-4 animate-in animate-in-delay-2">
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Showing <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> order{filtered.length !== 1 ? 's' : ''}
          {search && ` for "${search}"`}
        </span>
        {search && (
          <button className="btn btn-ghost btn-sm" onClick={() => setSearch('')} style={{ color: 'var(--danger)' }}>
            ✕ Clear search
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state animate-in">
          <span className="empty-icon">🔍</span>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders found</h3>
          <p>{search ? `No results for "${search}"` : `No ${statusTab.toLowerCase()} orders`}</p>
          {(search || statusTab !== 'All') && (
            <button
              className="btn btn-secondary mt-4"
              onClick={() => { setSearch(''); setStatusTab('All'); }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="cards-grid">
          {filtered.map((order, idx) => {
            const isDelivered = order.status?.toLowerCase() === 'delivered';
            return (
              <div
                key={order.orderId}
                className="animate-in"
                style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s`, display: 'flex', flexDirection: 'column' }}
              >
                <Link to={`/orders/${order.orderId}`} style={{ flex: 1 }}>
                  <OrderCard order={order} />
                </Link>
                {!isDelivered && order.status?.toLowerCase() === 'pending' && (
                  <button
                    onClick={() => handleMarkDelivered(order.orderId)}
                    className="btn btn-success mt-2"
                    style={{ width: '100%' }}
                  >
                    ✅ Mark as Delivered
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
