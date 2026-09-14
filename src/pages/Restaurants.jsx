import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getValidOrders } from '../services/utils';
import { HBarChart } from '../components/Charts';
import { SkeletonPage } from '../components/Skeleton';

export default function Restaurants() {
  const { state } = useAppContext();
  const { loading, error } = state;
  const validOrders = useMemo(() => getValidOrders(state.orders), [state.orders]);

  const restaurants = useMemo(() => {
    const map = {};
    validOrders.forEach(o => {
      const r = o.restaurant;
      if (!r) return;
      if (!map[r]) map[r] = { name: r, orders: 0, revenue: 0, delivered: 0, cancelled: 0, pending: 0, ratings: [] };
      map[r].orders++;
      map[r].revenue += o.totalAmount || 0;
      const s = (o.status || '').toLowerCase();
      if (s === 'delivered') map[r].delivered++;
      else if (s === 'cancelled') map[r].cancelled++;
      else if (s === 'pending') map[r].pending++;
      if (o.rating) map[r].ratings.push(o.rating);
    });

    return Object.values(map).map(r => ({
      ...r,
      avgRating: r.ratings.length
        ? Math.round((r.ratings.reduce((s, v) => s + v, 0) / r.ratings.length) * 10) / 10
        : null,
      deliveryRate: r.orders > 0 ? Math.round((r.delivered / r.orders) * 100) : 0,
    })).sort((a, b) => b.revenue - a.revenue);
  }, [validOrders]);

  const revenueChart = restaurants.slice(0, 8).map(r => ({ label: r.name, value: r.revenue }));

  if (loading) return <SkeletonPage />;
  if (error) return <div className="page-container"><p className="text-danger">{error}</p></div>;

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>🏪 Restaurants</h1>
        <p>{restaurants.length} restaurants · performance overview</p>
      </div>

      {/* Revenue chart */}
      <div className="chart-container animate-in animate-in-delay-1 mb-6">
        <div className="chart-title">💸 Revenue by Restaurant</div>
        <HBarChart data={revenueChart} maxItems={8} />
      </div>

      {/* Table */}
      <div className="chart-container animate-in animate-in-delay-2">
        <div className="chart-title mb-4">📋 All Restaurants</div>
        <div className="table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Restaurant</th>
                <th className="text-right">Orders</th>
                <th className="text-right">Revenue</th>
                <th className="text-right">Delivery Rate</th>
                <th className="text-right">Avg Rating</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r, idx) => (
                <tr key={r.name}>
                  <td style={{ color: 'var(--text-subtle)', fontWeight: 600 }}>{idx + 1}</td>
                  <td>
                    <Link
                      to={`/filter`}
                      state={{ restaurant: r.name }}
                      style={{ fontWeight: 700, color: 'var(--primary-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                      <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--primary-light),var(--accent))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.875rem', fontWeight: 800, flexShrink: 0 }}>
                        {r.name[0]}
                      </span>
                      {r.name}
                    </Link>
                  </td>
                  <td className="text-right" style={{ fontWeight: 700 }}>{r.orders}</td>
                  <td className="text-right" style={{ fontWeight: 700, color: 'var(--success)' }}>₹{r.revenue.toLocaleString()}</td>
                  <td className="text-right">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <div style={{ width: 60, height: 6, background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${r.deliveryRate}%`, height: '100%', background: r.deliveryRate >= 70 ? 'var(--success)' : r.deliveryRate >= 40 ? 'var(--warning)' : 'var(--danger)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.875rem', color: r.deliveryRate >= 70 ? 'var(--success)' : r.deliveryRate >= 40 ? 'var(--warning)' : 'var(--danger)' }}>
                        {r.deliveryRate}%
                      </span>
                    </div>
                  </td>
                  <td className="text-right">
                    {r.avgRating
                      ? <span style={{ color: 'var(--warning)', fontWeight: 700 }}>⭐ {r.avgRating}</span>
                      : <span style={{ color: 'var(--text-subtle)' }}>—</span>}
                  </td>
                  <td className="text-right">
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                      {r.delivered > 0 && <span className="badge badge-delivered">{r.delivered}</span>}
                      {r.pending > 0 && <span className="badge badge-pending">{r.pending}</span>}
                      {r.cancelled > 0 && <span className="badge badge-cancelled">{r.cancelled}</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
