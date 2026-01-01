import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Removed StrictMode to prevent double API calls in development
createRoot(document.getElementById('root')!).render(<App />);
