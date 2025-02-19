import { createBrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage.tsx';
import SignUpPage from './SignUpPage.tsx';
import MoviesPage from './MoviesPage.tsx';

export const router = createBrowserRouter([
  { path: '/login', Component: LoginPage },
  { path: '/signup', Component: SignUpPage },
  { path: '/', Component: MoviesPage },
]);
