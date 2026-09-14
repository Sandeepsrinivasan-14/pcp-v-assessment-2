import React, { useContext, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import OrderCard from '../components/OrderCard';
import Pagination from '../components/Pagination';
import AddOrderModal from '../components/AddOrderModal';
import { getValidOrders, exportOrdersToCSV } from '../services/utils';
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
const PAGE_SIZE = 12;

const Orders = () => {
  const { state, dispatch } = useContext(AppContext);
  const { addToast } = useToast();
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('All');
  const [sort, setSort] = useState('default');
  const [page, setPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => ({
    All: validOrders.length,
    Pending: validOrders.filter(o => o.status?.toLowerCase() === 'pending').length,
    Delivered: validOrders.filter(o => o.status?.toLowerCase() === 'delivered').length,
    Cancelled: validOrders.filter(o => o.status?.toLowerCase() === 'cancelled').length,
  }), [validOrders]);

  const handleTabChange = (tab) => { setStatusTab(tab); setPage(1); };
  const handleSearch = (v) => { setSearch(v); setPage(1); };

  const handleMarkDelivered = (orderId) => {
    const order = state.orders.find(o => o.orderId === orderId);
    if (order && order.status?.toLowerCase() !== 'delivered') {
      dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: 'delivered' } });
      addToast(`Order #${orderId} marked as delivered! ✅`, 'success');
    }
  };

  const handleDelete = (orderId) => {
    dispatch({ type: 'DELETE_ORDER', payload: orderId });
    addToast(`Order #${orderId} removed`, 'warning');
  };

  const handleExport = () => {
    exportOrdersToCSV(filtered);
    addToast(`Exported ${filtered.length} orders to CSV 📥`, 'success');
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
      {showAddModal && <AddOrderModal onClose={() => setShowAddModal(false)} />}

      <div className="flex items-center justify-between flex-wrap gap-3 mb-4 animate-in">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 style={{ marginBottom: '0.25rem' }}>📦 Orders</h1>
          <p>Manage and track all food delivery orders</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={handleExport} className="btn btn-secondary">
            📥 Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            ➕ New Order
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="filter-bar animate-in animate-in-delay-1">
        <div className="filter-tabs">
          {STATUS_TABS.map(tab => (
            <button
              key={tab}
              className={`filter-tab${statusTab === tab ? ' active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab}
              <span style={{
                marginLeft: 4,
                background: statusTab === tab ? 'rgba(109,40,217,0.12)' : 'var(--border)',
                color: statusTab === tab ? 'var(--primary-light)' : 'var(--text-muted)',
                padding: '1px 6px', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
              }}>
                {counts[tab]}
              </span>
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="🔍 Search by name, restaurant, ID..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="premium-input"
          style={{ flex: 1, minWidth: 200 }}
        />

        <div className="select-wrapper" style={{ minWidth: 180 }}>
          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }} className="premium-select">
            {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 animate-in animate-in-delay-2">
        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          <strong style={{ color: 'var(--text)' }}>{filtered.length}</strong> order{filtered.length !== 1 ? 's' : ''}
          {search && ` for "${search}"`}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </span>
        {(search || statusTab !== 'All') && (
          <button className="btn btn-ghost btn-sm" onClick={() => { handleSearch(''); handleTabChange('All'); }} style={{ color: 'var(--danger)' }}>
            ✕ Clear filters
          </button>
        )}
      </div>

      {paginated.length === 0 ? (
        <div className="empty-state animate-in">
          <span className="empty-icon">🔍</span>
          <h3 style={{ marginBottom: '0.5rem' }}>No orders found</h3>
          <p>{search ? `No results for "${search}"` : `No ${statusTab.toLowerCase()} orders`}</p>
          <button className="btn btn-secondary mt-4" onClick={() => { handleSearch(''); handleTabChange('All'); }}>
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="cards-grid">
            {paginated.map((order, idx) => {
              const isDelivered = order.status?.toLowerCase() === 'delivered';
              const isCancelled = order.status?.toLowerCase() === 'cancelled';
              return (
                <div
                  key={order.orderId}
                  className="animate-in"
                  style={{ animationDelay: `${Math.min(idx * 0.04, 0.4)}s`, display: 'flex', flexDirection: 'column' }}
                >
                  <Link to={`/orders/${order.orderId}`} style={{ flex: 1 }}>
                    <OrderCard order={order} />
                  </Link>
                  {!isDelivered && !isCancelled && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleMarkDelivered(order.orderId)} className="btn btn-success btn-sm" style={{ flex: 1 }}>
                        ✅ Deliver
                      </button>
                      <button onClick={() => handleDelete(order.orderId)} className="btn btn-ghost btn-sm btn-icon" style={{ color: 'var(--danger)', border: '1px solid var(--danger-border)' }}>
                        🗑
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Orders;
