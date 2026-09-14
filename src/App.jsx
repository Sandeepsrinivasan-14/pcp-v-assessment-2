import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';

function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </ToastProvider>
    </AppProvider>
  );
}

export default App;
