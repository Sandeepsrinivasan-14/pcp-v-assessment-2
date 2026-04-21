import { useAppContext } from '../context/AppContext'
import { Link } from 'react-router-dom'

function Home() {
  const { state, updateOrderStatus } = useAppContext()
  const { orders } = state

  const markAsDelivered = (orderId) => {
    updateOrderStatus(orderId, 'delivered')
  }

  const pendingOrders = orders.filter(order => order.status === 'pending')

  return (
    <div>
      <h1>Orders</h1>
      <div>
        {pendingOrders.map(order => (
          <div key={order.orderId} data-testid="order-item">
            <Link to={`/orders/${order.orderId}`}>
              <h3>Order #{order.orderId}</h3>
            </Link>
            <p>Customer: {order.customerName || 'Unknown'}</p>
            <p>Restaurant: {order.restaurant}</p>
            <p>Status: {order.status}</p>
            <button onClick={() => markAsDelivered(order.orderId)}>
              Mark as Delivered
            </button>
            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
