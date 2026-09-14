import { useAppContext } from '../context/AppContext';
import { useEffect, useMemo } from 'react';
import { getOrderStats, getValidOrders } from '../services/utils';
import { DonutChart, HBarChart, AnimatedNumber } from '../components/Charts';
import { SkeletonPage } from '../components/Skeleton';

function Stats() {
  const { state } = useAppContext();
  const { orders, loading, error } = state;
  const validOrders = useMemo(() => getValidOrders(orders), [orders]);
  const { totalOrders, deliveredOrders, cancelledOrders } = useMemo(() => getOrderStats(orders), [orders]);
  const pending = useMemo(() => validOrders.filter(o => o.status?.toLowerCase() === 'pending').length, [validOrders]);
  const totalRevenue = useMemo(() => validOrders.reduce((s, o) => s + (o.totalAmount || 0), 0), [validOrders]);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
  const maxOrder = useMemo(() => Math.max(...validOrders.map(o => o.totalAmount || 0), 0), [validOrders]);
  const minOrder = useMemo(() => {
    const vals = validOrders.map(o => o.totalAmount || 0).filter(v => v > 0);
    return vals.length ? Math.min(...vals) : 0;
  }, [validOrders]);

  const deliveryRate = totalOrders > 0 ? ((deliveredOrders / totalOrders) * 100).toFixed(1) : '0.0';
  const cancelRate = totalOrders > 0 ? ((cancelledOrders / totalOrders) * 100).toFixed(1) : '0.0';

  const restaurantRevenue = useMemo(() => {
    const map = {};
    validOrders.forEach(o => {
      if (!o.restaurant) return;
      map[o.restaurant] = (map[o.restaurant] || 0) + (o.totalAmount || 0);
    });
    return Object.entries(map).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [validOrders]);

  const restaurantOrders = useMemo(() => {
    const map = {};
    validOrders.forEach(o => {
      if (!o.restaurant) return;
      map[o.restaurant] = (map[o.restaurant] || 0) + 1;
    });
    return Object.entries(map).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [validOrders]);

  const topRated = useMemo(() => {
    const map = {};
    const cnt = {};
    validOrders.forEach(o => {
      if (!o.restaurant || !o.rating) return;
      map[o.restaurant] = (map[o.restaurant] || 0) + o.rating;
      cnt[o.restaurant] = (cnt[o.restaurant] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, sum]) => ({ label, value: Math.round((sum / cnt[label]) * 10) / 10 }))
      .filter(d => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [validOrders]);

  const donutData = [
    { label: 'Delivered', value: deliveredOrders, color: 'var(--success)' },
    { label: 'Pending', value: pending, color: 'var(--warning)' },
    { label: 'Cancelled', value: cancelledOrders, color: 'var(--danger)' },
  ];

  useEffect(() => {
    window.appState = { totalOrders, deliveredOrders, cancelledOrders };
  }, [totalOrders, deliveredOrders, cancelledOrders]);

  if (loading) return <SkeletonPage />;
  if (error) return <div className="page-container"><div className="info-box" style={{ borderColor: 'var(--danger)' }}><p style={{ color: 'var(--danger)' }}>{error}</p></div></div>;

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>📊 Analytics Dashboard</h1>
        <p>Deep insights into your order performance and restaurant trends</p>
      </div>

      {/* KPI Stats */}
      <div className="stats-grid animate-in animate-in-delay-1">
        <div className="stat-card tc-primary">
          <div className="stat-icon primary">📦</div>
          <h3>Total Orders</h3>
          <div className="number" data-testid="total-orders"><AnimatedNumber target={totalOrders} /></div>
          <div className="stat-trend">Valid orders processed</div>
        </div>
        <div className="stat-card tc-success">
          <div className="stat-icon success">✅</div>
          <h3>Delivered</h3>
          <div className="number" data-testid="delivered-orders"><AnimatedNumber target={deliveredOrders} /></div>
          <div className="stat-trend up">{deliveryRate}% delivery rate</div>
        </div>
        <div className="stat-card tc-danger">
          <div className="stat-icon danger">❌</div>
          <h3>Cancelled</h3>
          <div className="number" data-testid="cancelled-orders"><AnimatedNumber target={cancelledOrders} /></div>
          <div className="stat-trend down">{cancelRate}% cancel rate</div>
        </div>
        <div className="stat-card tc-warning">
          <div className="stat-icon warning">⏳</div>
          <h3>Pending</h3>
          <div className="number"><AnimatedNumber target={pending} /></div>
          <div className="stat-trend">Awaiting delivery</div>
        </div>
        <div className="stat-card tc-accent">
          <div className="stat-icon accent">💰</div>
          <h3>Total Revenue</h3>
          <div className="number"><AnimatedNumber target={totalRevenue} prefix="₹" /></div>
          <div className="stat-trend">Across all orders</div>
        </div>
      </div>

      {/* Revenue metrics */}
      <div className="chart-container animate-in animate-in-delay-2 mb-6">
        <div className="chart-title">💡 Revenue Metrics</div>
        <div className="grid-3" style={{ gap: '1.5rem' }}>
          {[
            { label: 'Average Order Value', value: `₹${avgOrderValue.toLocaleString()}`, icon: '📈' },
            { label: 'Highest Order', value: `₹${maxOrder.toLocaleString()}`, icon: '🏆' },
            { label: 'Lowest Order', value: `₹${minOrder.toLocaleString()}`, icon: '📉' },
          ].map((m, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{m.icon}</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text)', fontFamily: 'var(--font-display)' }}>{m.value}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.25rem', fontWeight: 600 }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="grid-2 animate-in animate-in-delay-3 mb-6">
        <div className="chart-container">
          <div className="chart-title">🎯 Status Breakdown</div>
          <DonutChart data={donutData} />
        </div>
        <div className="chart-container">
          <div className="chart-title">⭐ Top Rated Restaurants</div>
          {topRated.length > 0 ? (
            <HBarChart
              data={topRated.map(d => ({ ...d, suffix: '★' }))}
              maxItems={6}
              colorPrimary="var(--warning)"
              colorSecondary="var(--pink)"
            />
          ) : (
            <p className="text-muted" style={{ padding: '1rem 0' }}>No rating data available</p>
          )}
        </div>
      </div>

      <div className="chart-container animate-in animate-in-delay-4 mb-6">
        <div className="chart-title">🏪 Top Restaurants by Revenue</div>
        <HBarChart data={restaurantRevenue} maxItems={8} colorPrimary="var(--primary-light)" colorSecondary="var(--accent)" />
      </div>

      <div className="chart-container animate-in animate-in-delay-4">
        <div className="chart-title">📦 Top Restaurants by Order Volume</div>
        <HBarChart data={restaurantOrders} maxItems={8} colorPrimary="var(--accent)" colorSecondary="var(--success)" />
      </div>
    </div>
  );
}

export default Stats;
