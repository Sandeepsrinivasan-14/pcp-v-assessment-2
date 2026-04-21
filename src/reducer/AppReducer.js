export const initialState = {
  orders: [],
  loading: false,
  token: null,
  error: null
}

export const ACTIONS = {
  SET_TOKEN: 'SET_TOKEN',
  SET_ORDERS: 'SET_ORDERS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS'
}

export const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TOKEN:
      return { ...state, token: action.payload }
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload }
    case ACTIONS.SET_ORDERS:
      return { ...state, orders: action.payload }
    case ACTIONS.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.orderId === action.payload.orderId
            ? { ...order, status: action.payload.status }
            : order
        )
      }
    default:
      return state
  }
}
