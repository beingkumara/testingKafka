import { lazy } from 'react';
import { ROUTES } from './constants';

// Lazy-loaded page components
const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const SignupPage = lazy(() => import('../pages/SignupPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const DriversPage = lazy(() => import('../pages/DriversPage'));
const DriverDetailsPage = lazy(() => import('../pages/DriverDetailsPage'));
const RacesPage = lazy(() => import('../pages/RacesPage'));
const StandingsPage = lazy(() => import('../pages/StandingsPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

// Route configuration
export const routes = [
  {
    path: ROUTES.HOME,
    component: HomePage,
    exact: true,
    protected: false,
  },
  {
    path: ROUTES.LOGIN,
    component: LoginPage,
    exact: true,
    protected: false,
  },
  {
    path: ROUTES.SIGNUP,
    component: SignupPage,
    exact: true,
    protected: false,
  },
  {
    path: ROUTES.DASHBOARD,
    component: DashboardPage,
    exact: true,
    protected: true,
  },
  {
    path: ROUTES.DRIVERS,
    component: DriversPage,
    exact: true,
    protected: true,
  },
  {
    path: ROUTES.DRIVER_DETAILS,
    component: DriverDetailsPage,
    exact: true,
    protected: true,
  },
  {
    path: ROUTES.RACES,
    component: RacesPage,
    exact: true,
    protected: true,
  },
  {
    path: ROUTES.STANDINGS,
    component: StandingsPage,
    exact: true,
    protected: true,
  },
  {
    path: '*',
    component: NotFoundPage,
    protected: false,
  },
];