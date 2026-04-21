import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Orders from '../pages/Orders'
import Stats from '../pages/Stats'
import OrderDetail from '../pages/OrderDetail'
import Filter from '../pages/Filter'

function AppRouter() {
  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">Food Orders</div>
        <div className="flex gap-2">
          <Link to="/orders" className="nav-link">Orders</Link>
          <Link to="/filter" className="nav-link">Filter</Link>
          <Link to="/stats" className="nav-link">Stats</Link>
        </div>
      </nav>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Navigate to="/orders" replace />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/filter" element={<Filter />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </div>
    </>
  )
}

export default AppRouter
