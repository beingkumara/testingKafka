import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import DriversPage from './pages/DriversPage';
import RacesPage from './pages/RacesPage';
import StandingsPage from './pages/StandingsPage';
import NotFoundPage from './pages/NotFoundPage';
import './App.css';

function App() {
  useEffect(() => {
    // Update the document title
    document.title = 'F1nity - Formula 1 Analytics';
    
    // Update favicon
    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
    if (link) {
      link.href = '/favicon.svg';
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="drivers" 
                element={
                  <ProtectedRoute>
                    <DriversPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="races" 
                element={
                  <ProtectedRoute>
                    <RacesPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="standings" 
                element={
                  <ProtectedRoute>
                    <StandingsPage />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;