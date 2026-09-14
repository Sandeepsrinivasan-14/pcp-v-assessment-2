export const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return { ...state, orders: action.payload, loading: false };

    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map(o =>
          o.orderId === action.payload.orderId ? { ...o, status: action.payload.status } : o
        ),
      };

    case 'SET_FILTER':
      return { ...state, filteredRestaurant: action.payload };

    case 'RESET_FILTER':
      return { ...state, filteredRestaurant: '' };

    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };

    default:
      return state;
  }
};

export default AppReducer;
