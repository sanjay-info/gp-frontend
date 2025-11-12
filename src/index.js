import React from 'react';
import ReactDOM from 'react-dom/client';
import './theme.css';
import './style.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AppProvider } from './Pages/components/AppProvider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "react-image-lightbox/style.css";
import 'simple-lightbox/dist/simpleLightbox.min.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider>
      <App />
      <ToastContainer/>
    </AppProvider>
  </React.StrictMode>
);

reportWebVitals();