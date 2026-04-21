import { useAppContext } from '../context/AppContext'
import { useEffect } from 'react'

function Stats() {
  const { state } = useAppContext()
  const { orders } = state

  const validOrders = orders.filter(order => 
    order.status && ['delivered', 'cancelled', 'pending'].includes(order.status.toLowerCase())
  )

  const totalOrders = validOrders.length
  const deliveredOrders = validOrders.filter(order => order.status.toLowerCase() === 'delivered').length
  const cancelledOrders = validOrders.filter(order => order.status.toLowerCase() === 'cancelled').length

  useEffect(() => {
    window.appState = {
      totalOrders,
      deliveredOrders,
      cancelledOrders
    }
  }, [totalOrders, deliveredOrders, cancelledOrders])

  return (
    <div>
      <h1>Orders Analytics Dashboard</h1>
      <div>
        <div data-testid="total-orders">Total Orders: {totalOrders}</div>
        <div data-testid="delivered-orders">Delivered Orders: {deliveredOrders}</div>
        <div data-testid="cancelled-orders">Cancelled Orders: {cancelledOrders}</div>
      </div>
    </div>
  )
}

export default Stats
