import { useParams, Link } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function OrderDetail() {
  const { id } = useParams()
  const { state } = useAppContext()
  const { orders } = state

  const order = orders.find(o => o.orderId === parseInt(id))

  if (!order) {
    return <h2>Order not found</h2>
  }

  const calculateSubtotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  return (
    <div>
      <h1>Order Details #{order.orderId}</h1>
      <p><strong>Customer:</strong> {order.customerName || 'Unknown'}</p>
      <p><strong>Restaurant:</strong> {order.restaurant}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
      <p><strong>Delivery Time:</strong> {order.deliveryTime || 'Not specified'}</p>
      
      <h3>Items:</h3>
      {order.items && order.items.map((item, index) => (
        <div key={index}>
          <p>{item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}</p>
        </div>
      ))}
      <p><strong>Subtotal:</strong> ${calculateSubtotal(order.items || [])}</p>
      
      <Link to="/">Back to Orders</Link>
    </div>
  )
}

export default OrderDetail
