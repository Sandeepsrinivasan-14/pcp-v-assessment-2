import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { getValidOrders } from '../services/utils';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: '⚡' },
  { to: '/orders', label: 'Orders', icon: '📦' },
  { to: '/filter', label: 'Search', icon: '🔍' },
  { to: '/stats', label: 'Analytics', icon: '📊' },
];

export default function Navbar() {
  const { state, dispatch } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const pending = getValidOrders(state.orders).filter(o => o.status?.toLowerCase() === 'pending').length;

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-brand-icon">🍽️</span>
        FoodDash
      </div>

      <div className="nav-links">
        {NAV_ITEMS.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            {label}
          </NavLink>
        ))}
      </div>

      <div className="nav-actions">
        {pending > 0 && (
          <span className="nav-badge">
            <span className="pulse-dot" />
            {pending} pending
          </span>
        )}
        <button
          className="theme-toggle"
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
          title="Toggle dark/light mode"
        >
          {state.theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
