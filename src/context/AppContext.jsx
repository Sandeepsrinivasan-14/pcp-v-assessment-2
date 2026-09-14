import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AppReducer from '../reducer/AppReducer';
import { getToken, getDataset } from '../services/api';

export const AppContext = createContext();

const STUDENT_ID = 'E0423027';
const PASSWORD = '203264';
const SET = 'setA';

const getInitialTheme = () => {
  try { return localStorage.getItem('theme') || 'light'; } catch { return 'light'; }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AppReducer, {
    orders: [],
    filteredRestaurant: '',
    loading: true,
    error: null,
    theme: getInitialTheme(),
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
    try { localStorage.setItem('theme', state.theme); } catch {}
  }, [state.theme]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getToken(STUDENT_ID, PASSWORD, SET);
        const data = await getDataset();
        dispatch({ type: 'SET_ORDERS', payload: data.orders || [] });
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch data';
        dispatch({ type: 'SET_ERROR', payload: errorMsg });
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

export const useAppContext = () => useContext(AppContext);
