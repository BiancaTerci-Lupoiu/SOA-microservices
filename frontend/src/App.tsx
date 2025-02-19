import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';
import AuthProvider from './AuthContext.tsx';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
