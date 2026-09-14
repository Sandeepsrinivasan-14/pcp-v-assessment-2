export const isValidOrder = (order) => {
  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    return false;
  }

  const hasInvalidQuantity = order.items.some((item) => item.quantity <= 0);
  if (hasInvalidQuantity) {
    return false;
  }

  if (typeof order.totalAmount !== 'number' || order.totalAmount <= 0) {
    return false;
  }

  return true;
};

export const getValidOrders = (orders) => {
  return orders.filter(isValidOrder);
};

export const calculateItemSubtotal = (item) => {
  if (!item || !item.price || !item.quantity) return 0;
  return item.price * item.quantity;
};

export const filterOrdersByRestaurant = (orders, restaurantName) => {
  if (!restaurantName.trim()) {
    return [];
  }

  return orders.filter((order) =>
    order.restaurant
      .toLowerCase()
      .includes(restaurantName.toLowerCase())
  );
};

export const exportOrdersToCSV = (orders) => {
  const headers = ['Order ID', 'Customer', 'Restaurant', 'Status', 'Total Amount', 'Items', 'Rating', 'Delivery Time'];
  const rows = orders.map(o => [
    o.orderId,
    o.customerName || '',
    o.restaurant || '',
    o.status || '',
    o.totalAmount || 0,
    (o.items || []).map(i => `${i.name}x${i.quantity}`).join('; '),
    o.rating || '',
    o.deliveryTime || '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `fooddash-orders-${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
};

export const getOrderStats = (orders) => {
  const validOrders = getValidOrders(orders);

  return validOrders.reduce(
    (stats, order) => {
      stats.totalOrders += 1;

      if (order.status && order.status.toLowerCase() === 'delivered') {
        stats.deliveredOrders += 1;
      }

      if (order.status && order.status.toLowerCase() === 'cancelled') {
        stats.cancelledOrders += 1;
      }

      return stats;
    },
    { totalOrders: 0, deliveredOrders: 0, cancelledOrders: 0 }
  );
};
