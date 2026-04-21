import { useState } from 'react'
import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

function Filter() {
  const [restaurant, setRestaurant] = useState('')
  const [error, setError] = useState('')
  const { state } = useAppContext()
  const { orders } = state

  const filteredOrders = orders.filter(order => 
    order.restaurant && 
    order.restaurant.toLowerCase().includes(restaurant.toLowerCase())
  )

  const handleFilter = () => {
    if (!restaurant.trim()) {
      setError('Please enter a restaurant name')
    } else {
      setError('')
    }
  }

  return (
    <div>
      <h1>Filter Orders by Restaurant</h1>
      <div>
        <input
          data-testid="filter-input"
          type="text"
          placeholder="Enter restaurant name"
          value={restaurant}
          onChange={(e) => setRestaurant(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        {filteredOrders.length === 0 && restaurant && !error && (
          <p>No results found</p>
        )}
        {filteredOrders.map(order => (
          <div key={order.orderId} data-testid="order-item">
            <Link to={`/orders/${order.orderId}`}>
              <h3>Order #{order.orderId}</h3>
            </Link>
            <p>Customer: {order.customerName || 'Unknown'}</p>
            <p>Restaurant: {order.restaurant}</p>
            <p>Status: {order.status}</p>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Filter
