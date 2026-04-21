import React, { createContext, useReducer, useEffect } from 'react';
import AppReducer from '../reducer/AppReducer';
import { getToken, getDataset } from '../services/api';

export const AppContext = createContext();


const STUDENT_ID = 'E0423027';
const PASSWORD = '203264';
const SET = 'setA';

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, {
    orders: [],
    filteredRestaurant: '',
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokenResponse = await getToken(STUDENT_ID, PASSWORD, SET);

        const data = await getDataset();
        dispatch({ type: 'SET_ORDERS', payload: data.orders || [] });
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch data';
        console.error('Error in fetchData:', errorMsg);
        dispatch({
          type: 'SET_ERROR',
          payload: errorMsg,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => React.useContext(AppContext);
