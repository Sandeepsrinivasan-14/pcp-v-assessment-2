import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getValidOrders, getOrderStats } from '../services/utils';
import { DonutChart, HBarChart, AnimatedNumber, VBarChart } from '../components/Charts';
import { SkeletonPage } from '../components/Skeleton';

export default function Dashboard() {
  const { state } = useAppContext();
  const { loading, error, orders } = state;

  const validOrders = useMemo(() => getValidOrders(orders), [orders]);
  const stats = useMemo(() => getOrderStats(orders), [orders]);

  const pending = useMemo(() => validOrders.filter(o => o.status?.toLowerCase() === 'pending').length, [validOrders]);

  const totalRevenue = useMemo(() =>
    validOrders.reduce((s, o) => s + (o.totalAmount || 0), 0), [validOrders]);

  const avgOrderValue = useMemo(() =>
    stats.totalOrders > 0 ? Math.round(totalRevenue / stats.totalOrders) : 0, [totalRevenue, stats.totalOrders]);

  const restaurantRevenue = useMemo(() => {
    const map = {};
    validOrders.forEach(o => {
      if (!o.restaurant) return;
      map[o.restaurant] = (map[o.restaurant] || 0) + (o.totalAmount || 0);
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [validOrders]);

  const restaurantOrderCount = useMemo(() => {
    const map = {};
    validOrders.forEach(o => {
      if (!o.restaurant) return;
      map[o.restaurant] = (map[o.restaurant] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [validOrders]);

  const donutData = [
    { label: 'Delivered', value: stats.deliveredOrders, color: 'var(--success)' },
    { label: 'Pending', value: pending, color: 'var(--warning)' },
    { label: 'Cancelled', value: stats.cancelledOrders, color: 'var(--danger)' },
  ];

  const recentOrders = useMemo(() => validOrders.slice(0, 5), [validOrders]);

  if (loading) return <SkeletonPage />;

  if (error) return (
    <div className="page-container">
      <div className="info-box" style={{ borderColor: 'var(--danger)', background: 'var(--danger-bg)' }}>
        <h3 style={{ color: 'var(--danger)' }}>❌ Error Loading Data</h3>
        <p style={{ color: 'var(--danger)', marginTop: '0.5rem' }}>{error}</p>
      </div>
    </div>
  );

  return (
    <div className="page-container">
      {/* Hero */}
      <div className="hero animate-in">
        <div className="hero-bg" />
        <div className="hero-title">Welcome to FoodDash 🍽️</div>
        <p className="hero-sub">
          Your complete food order management platform. Track orders, analyze performance, and stay on top of deliveries in real-time.
        </p>
        <div className="flex gap-3 mt-6 flex-wrap">
          <Link to="/orders" className="btn btn-primary btn-lg">
            📦 View Orders
          </Link>
          <Link to="/stats" className="btn btn-secondary btn-lg">
            📊 Analytics
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-grid animate-in animate-in-delay-1">
        <div className="stat-card tc-primary">
          <div className="stat-icon primary">📦</div>
          <h3>Total Orders</h3>
          <div className="number" data-testid="total-orders">
            <AnimatedNumber target={stats.totalOrders} />
          </div>
          <div className="stat-trend">All valid orders</div>
        </div>
        <div className="stat-card tc-success">
          <div className="stat-icon success">✅</div>
          <h3>Delivered</h3>
          <div className="number" data-testid="delivered-orders">
            <AnimatedNumber target={stats.deliveredOrders} />
          </div>
          <div className="stat-trend up">
            {stats.totalOrders > 0 ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0}% delivery rate
          </div>
        </div>
        <div className="stat-card tc-warning">
          <div className="stat-icon warning">⏳</div>
          <h3>Pending</h3>
          <div className="number"><AnimatedNumber target={pending} /></div>
          <div className="stat-trend">Awaiting delivery</div>
        </div>
        <div className="stat-card tc-danger">
          <div className="stat-icon danger">❌</div>
          <h3>Cancelled</h3>
          <div className="number" data-testid="cancelled-orders">
            <AnimatedNumber target={stats.cancelledOrders} />
          </div>
          <div className="stat-trend down">
            {stats.totalOrders > 0 ? Math.round((stats.cancelledOrders / stats.totalOrders) * 100) : 0}% cancel rate
          </div>
        </div>
        <div className="stat-card tc-accent">
          <div className="stat-icon accent">💰</div>
          <h3>Total Revenue</h3>
          <div className="number">
            <AnimatedNumber target={totalRevenue} prefix="₹" />
          </div>
          <div className="stat-trend">Avg ₹{avgOrderValue}/order</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid-2 animate-in animate-in-delay-2 mb-6">
        <div className="chart-container">
          <div className="chart-title">🎯 Order Status Distribution</div>
          <DonutChart data={donutData} />
        </div>

        <div className="chart-container">
          <div className="chart-title">🏆 Top Restaurants by Orders</div>
          <HBarChart data={restaurantOrderCount} maxItems={6} />
        </div>
      </div>

      {/* Revenue chart */}
      <div className="chart-container animate-in animate-in-delay-3 mb-6">
        <div className="chart-title">💸 Top Restaurants by Revenue</div>
        <HBarChart
          data={restaurantRevenue}
          maxItems={8}
          colorPrimary="var(--accent)"
          colorSecondary="var(--pink)"
        />
      </div>

      {/* Recent Orders */}
      <div className="chart-container animate-in animate-in-delay-4">
        <div className="flex items-center justify-between mb-4">
          <div className="chart-title mb-0" style={{ marginBottom: 0 }}>🕐 Recent Orders</div>
          <Link to="/orders" className="btn btn-ghost btn-sm" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
            View all →
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <span className="empty-icon" style={{ fontSize: '2rem' }}>📭</span>
            <p>No recent orders</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Restaurant</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(o => (
                  <tr key={o.orderId}>
                    <td>
                      <Link to={`/orders/${o.orderId}`} style={{ color: 'var(--primary-light)', fontWeight: 700 }}>
                        #{o.orderId}
                      </Link>
                    </td>
                    <td style={{ fontWeight: 500 }}>{o.customerName || 'Unknown'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{o.restaurant}</td>
                    <td>
                      <span className={`badge badge-${(o.status || '').toLowerCase()}`}>{o.status}</span>
                    </td>
                    <td className="text-right" style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                      ₹{o.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
