const initialState = {
  orders: [],
  filteredRestaurant: '',
  loading: true,
  error: null,
};

export const AppReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ORDERS':
      return {
        ...state,
        orders: action.payload,
        loading: false,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((order) =>
          order.orderId === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        ),
      };

    case 'SET_FILTER':
      return {
        ...state,
        filteredRestaurant: action.payload,
      };

    case 'RESET_FILTER':
      return {
        ...state,
        filteredRestaurant: '',
      };

    default:
      return state;
  }
};

export default AppReducer;
