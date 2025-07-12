import React from 'react';
import ReactDOM from 'react-dom/client'; // ¡importa desde 'react-dom/client'!
import './index.css';
import App from './App';

// Forzar modo oscuro
document.documentElement.classList.add('dark');

// Crear root y montar la app (nuevo desde React 18+)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
