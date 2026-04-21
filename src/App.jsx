import { BrowserRouter } from 'react-router-dom'
import AppRouter from './router/AppRouter'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
