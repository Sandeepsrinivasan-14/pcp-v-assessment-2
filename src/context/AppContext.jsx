import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { appReducer, initialState, ACTIONS } from '../reducer/AppReducer';
import { getToken, fetchOrders, authenticateAndFetch } from '../services/api';

const AppContext = createContext();

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const updateOrderStatus = (orderId, status) => {
    dispatch({ type: ACTIONS.UPDATE_ORDER_STATUS, payload: { orderId, status } });
  };

  const setError = (error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  };

  useEffect(() => {
    const loadData = async () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      clearError();
      
      // TRY ALL POSSIBLE CREDENTIALS
      const credentialsToTry = [
        { studentId: 'e0423027', password: '203264' },
        { studentId: 'E0423027', password: '203264' },
        { studentId: '0423027', password: '203264' },
        { studentId: 'SANDEEP', password: '203264' },
        { studentId: 'SANDEEP SRINIVASAN S', password: '203264' },
        { studentId: 'sandeep', password: '203264' }
      ];
      
      let success = false;
      
      for (const cred of credentialsToTry) {
        if (success) break;
        
        try {
          console.log(`Attempting with: ${cred.studentId}`);
          
          // Method 1: Individual calls
          const token = await getToken(cred.studentId, cred.password);
          console.log('? Token obtained!');
          
          const orders = await fetchOrders(token);
          console.log('? Orders fetched!', orders.length);
          
          // Validate orders
          const validOrders = orders.filter(order => 
            order && 
            order.orderId && 
            order.status && 
            ['pending', 'delivered', 'cancelled'].includes(order.status.toLowerCase())
          );
          
          dispatch({ type: ACTIONS.SET_TOKEN, payload: token });
          dispatch({ type: ACTIONS.SET_ORDERS, payload: validOrders });
          dispatch({ type: ACTIONS.SET_LOADING, payload: false });
          
          console.log(`? Success with credentials: ${cred.studentId}`);
          success = true;
          break;
          
        } catch (error) {
          console.log(`? Failed with ${cred.studentId}:`, error.message);
          setError(`Authentication failed for ${cred.studentId}: ${error.message}`);
        }
      }
      
      if (!success) {
        dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        setError('Unable to authenticate. Please check your credentials with the trainer.');
        console.error('All credential attempts failed');
      }
    };
    
    loadData();
  }, []);

  return (
    <AppContext.Provider value={{ 
      state, 
      dispatch, 
      updateOrderStatus,
      setError,
      clearError
    }}>
      {children}
    </AppContext.Provider>
  );
};
