import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/ui/LoadingScreen';
import { APP_SETTINGS, ROUTES } from './config/constants';
import './App.css';

// Lazy-loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const DriversPage = lazy(() => import('./pages/DriversPage'));
const DriverDetailsPage = lazy(() => import('./pages/DriverDetailsPage'));
const RacesPage = lazy(() => import('./pages/RacesPage'));
const RaceDetailsPage = lazy(() => import('./pages/RaceDetailsPage'));
const StandingsPage = lazy(() => import('./pages/StandingsPage'));
const RaceResultsPage = lazy(() => import('./pages/RaceResults'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  useEffect(() => {
    // Update the document title
    document.title = APP_SETTINGS.APP_NAME + ' - ' + APP_SETTINGS.APP_DESCRIPTION;
    
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
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path={ROUTES.HOME} element={<Layout />}>
                <Route index element={<HomePage />} />
                <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                <Route path={ROUTES.SIGNUP} element={<SignupPage />} />
                <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
                <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
                <Route 
                  path={ROUTES.DASHBOARD}
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.DRIVERS}
                  element={
                    <ProtectedRoute>
                      <DriversPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.DRIVER_DETAILS}
                  element={
                    <ProtectedRoute>
                      <DriverDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.RACES}
                  element={
                    <ProtectedRoute>
                      <RacesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.RACE_DETAILS}
                  element={
                    <ProtectedRoute>
                      <RaceDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.STANDINGS}
                  element={
                    <ProtectedRoute>
                      <StandingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path={ROUTES.RACE_RESULTS}
                  element={
                    <ProtectedRoute>
                      <RaceResultsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;