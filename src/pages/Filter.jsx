import React, { useContext, useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import OrderCard from '../components/OrderCard';
import { filterOrdersByRestaurant, getValidOrders } from '../services/utils';
import { SkeletonPage } from '../components/Skeleton';

const Filter = () => {
  const { state, dispatch } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);

  const validOrders = useMemo(() => getValidOrders(state.orders), [state.orders]);

  const allRestaurants = useMemo(() => {
    const set = new Set(validOrders.map(o => o.restaurant).filter(Boolean));
    return [...set].sort();
  }, [validOrders]);

  const suggestions = useMemo(() => {
    if (!searchInput.trim()) return [];
    return allRestaurants.filter(r => r.toLowerCase().includes(searchInput.toLowerCase())).slice(0, 6);
  }, [searchInput, allRestaurants]);

  const handleSearch = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (!searchInput.trim()) {
      dispatch({ type: 'SET_FILTER', payload: '' });
      setSearchPerformed(true);
      return;
    }
    dispatch({ type: 'SET_FILTER', payload: searchInput });
    setSearchPerformed(true);
  };

  const handleSuggestion = (restaurant) => {
    setSearchInput(restaurant);
    dispatch({ type: 'SET_FILTER', payload: restaurant });
    setSearchPerformed(true);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch({ type: 'RESET_FILTER' });
    setSearchPerformed(false);
    setShowSuggestions(false);
  };

  const filteredOrders = useMemo(() => {
    if (!searchPerformed || !state.filteredRestaurant.trim()) return [];
    return filterOrdersByRestaurant(validOrders, state.filteredRestaurant);
  }, [searchPerformed, state.filteredRestaurant, validOrders]);

  if (state.loading) return <SkeletonPage />;

  return (
    <div className="page-container">
      <div className="page-header animate-in">
        <h1>🔍 Search Orders</h1>
        <p>Find orders by restaurant name. {allRestaurants.length} restaurants available.</p>
      </div>

      <form onSubmit={handleSearch} className="animate-in animate-in-delay-1">
        <div style={{ position: 'relative', marginBottom: '0.5rem' }}>
          <div className="flex gap-3 items-center" style={{
            background: 'var(--surface)',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.75rem 1rem',
            boxShadow: 'var(--shadow-md)',
            transition: 'var(--transition)',
          }}>
            <span style={{ fontSize: '1.25rem' }}>🔍</span>
            <input
              ref={inputRef}
              data-testid="filter-input"
              type="text"
              placeholder="Type a restaurant name..."
              value={searchInput}
              onChange={e => { setSearchInput(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
              style={{
                flex: 1,
                background: 'none',
                border: 'none',
                outline: 'none',
                fontSize: '1rem',
                color: 'var(--text)',
                fontFamily: 'var(--font-main)',
              }}
            />
            {searchInput && (
              <button type="button" onClick={handleReset} className="btn btn-ghost btn-sm btn-icon" style={{ color: 'var(--text-muted)' }}>
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete */}
          {showSuggestions && suggestions.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0, right: 0,
              marginTop: '0.375rem',
              background: 'var(--surface-solid)',
              border: '1px solid var(--border-strong)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xl)',
              zIndex: 50,
              overflow: 'hidden',
            }}>
              {suggestions.map((r, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={() => handleSuggestion(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: 'none',
                    background: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9375rem',
                    color: 'var(--text)',
                    fontFamily: 'var(--font-main)',
                    textAlign: 'left',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(109,40,217,0.06)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                >
                  <span>🏪</span>
                  {r}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
            🔍 Search Orders
          </button>
          <button type="button" onClick={handleReset} className="btn btn-secondary btn-lg">
            Reset
          </button>
        </div>
      </form>

      {/* Quick picks */}
      {!searchPerformed && allRestaurants.length > 0 && (
        <div className="animate-in animate-in-delay-2 mt-6">
          <p className="text-sm text-muted mb-3 font-semibold text-uppercase" style={{ letterSpacing: '0.06em' }}>
            Popular Restaurants
          </p>
          <div className="flex flex-wrap gap-2">
            {allRestaurants.slice(0, 10).map((r, i) => (
              <button
                key={i}
                onClick={() => handleSuggestion(r)}
                className="btn btn-secondary btn-sm"
              >
                🏪 {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {searchPerformed && (
        <div className="mt-6">
          {!searchInput.trim() ? (
            <div className="info-box animate-in" style={{ borderColor: 'var(--danger-border)', background: 'var(--danger-bg)' }}>
              <p style={{ color: 'var(--danger)', fontWeight: 600 }}>❌ Please enter a restaurant name to search.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state animate-in">
              <span className="empty-icon">🔍</span>
              <h3>No results found</h3>
              <p>No orders found for "{state.filteredRestaurant}"</p>
              <button onClick={handleReset} className="btn btn-secondary mt-4">Clear search</button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4 animate-in">
                <span className="badge badge-delivered" style={{ fontSize: '0.875rem', padding: '6px 14px' }}>
                  ✅ {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
                </span>
                <span className="text-muted text-sm">
                  for <strong style={{ color: 'var(--text)' }}>"{state.filteredRestaurant}"</strong>
                </span>
              </div>
              <div className="cards-grid">
                {filteredOrders.map((order, idx) => (
                  <div key={order.orderId} className="animate-in" style={{ animationDelay: `${idx * 0.04}s` }}>
                    <Link to={`/orders/${order.orderId}`}>
                      <OrderCard order={order} />
                    </Link>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;
