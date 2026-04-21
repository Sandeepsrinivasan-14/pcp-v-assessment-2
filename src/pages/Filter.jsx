import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import OrderCard from '../components/OrderCard';
import {
  filterOrdersByRestaurant,
  getValidOrders,
} from '../services/utils';

const Filter = () => {
  const { state, dispatch } = useContext(AppContext);
  const [searchInput, setSearchInput] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();

    if (!searchInput.trim()) {
      dispatch({ type: 'SET_FILTER', payload: '' });
      setSearchPerformed(true);
      return;
    }

    dispatch({ type: 'SET_FILTER', payload: searchInput });
    setSearchPerformed(true);
  };

  const handleReset = () => {
    setSearchInput('');
    dispatch({ type: 'RESET_FILTER' });
    setSearchPerformed(false);
  };

  const validOrders = getValidOrders(state.orders);
  let filteredOrders = validOrders;

  if (searchPerformed && state.filteredRestaurant.trim()) {
    filteredOrders = filterOrdersByRestaurant(validOrders, state.filteredRestaurant);
  }

  return (
    <div className="page-container">
      <div className="flex justify-between align-center mb-6">
        <h1>🔍 Filter Orders</h1>
        <p className="text-muted">Find specific restaurant orders</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-4 align-center mb-6 p-4 premium-card" style={{ boxShadow: 'var(--shadow-md)' }}>
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Start typing a restaurant name..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="premium-input"
          style={{ flex: 1, padding: '1.25rem' }}
        />
        <button type="submit" className="btn btn-primary" style={{ padding: '1.25rem 2rem', fontSize: '1.125rem' }}>
          Search
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="btn btn-secondary"
          style={{ padding: '1.25rem 2rem', fontSize: '1.125rem' }}
        >
          Reset
        </button>
      </form>

      {searchPerformed && (
        <div className="mt-6">
          {!searchInput.trim() ? (
            <div className="info-box border-danger bg-danger-light">
              <p className="text-giant" style={{ color: 'var(--danger)', fontSize: '1.25rem' }}>❌ Please enter a restaurant name.</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="info-box text-center py-8">
              <p className="text-giant" style={{ color: 'var(--text-muted)' }}>No results found for "{state.filteredRestaurant}"</p>
            </div>
          ) : (
            <>
              <div className="badge badge-delivered mb-4" style={{ display: 'inline-block', fontSize: '1rem', padding: '8px 16px' }}>
                Found {filteredOrders.length} matching order(s)
              </div>
              <div className="cards-grid mt-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.orderId} order={order} />
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
