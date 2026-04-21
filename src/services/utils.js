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
