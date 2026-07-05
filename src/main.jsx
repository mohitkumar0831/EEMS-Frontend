import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { StateProvider } from './context/StateContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StateProvider>
      <SocketProvider>
        <App />
      </SocketProvider>
    </StateProvider>
  </StrictMode>,
)
