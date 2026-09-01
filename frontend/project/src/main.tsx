import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';

// Removed StrictMode to prevent double API calls in development
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '1012662831288-saksn9f9o1rm7itl3uuvamo0spt90oc0.apps.googleusercontent.com';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={clientId}>
    <App />
  </GoogleOAuthProvider>
);
