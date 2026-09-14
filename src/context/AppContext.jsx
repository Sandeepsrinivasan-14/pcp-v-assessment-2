import React, { createContext, useReducer, useEffect, useContext } from 'react';
import AppReducer from '../reducer/AppReducer';
import { MOCK_ORDERS } from '../services/mockData';

export const AppContext = createContext();

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
    // Simulate a brief loading delay so the skeleton is visible, then load mock data
    const timer = setTimeout(() => {
      dispatch({ type: 'SET_ORDERS', payload: MOCK_ORDERS });
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
