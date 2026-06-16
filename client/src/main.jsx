import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles.css';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './store/SocketContext'; // ← add this

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>          {/* ← wrap here */}
          <App />
          <Toaster position="top-right" toastOptions={{ style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.08)' } }} />
        </SocketProvider>          {/* ← close here */}
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);