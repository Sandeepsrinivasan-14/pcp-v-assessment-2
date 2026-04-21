import { Routes, Route, Link } from 'react-router-dom'
import Home from '../pages/Home'
import OrderDetail from '../pages/OrderDetail'
import Filter from '../pages/Filter'
import Stats from '../pages/Stats'

function AppRouter() {
  return (
    <div>
      <nav style={{ padding: '10px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/" style={{ margin: '10px' }}>Orders</Link>
        <Link to="/filter" style={{ margin: '10px' }}>Filter</Link>
        <Link to="/stats" style={{ margin: '10px' }}>Stats</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/filter" element={<Filter />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </div>
  )
}

export default AppRouter
