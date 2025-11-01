import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Clients from '../pages/Clients';
import Protected from '../components/Protected';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* no layout here */}
        <Route path="/login" element={<Login />} />
        {/* protected pages */}
        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/clients"
          element={
            <Protected>
              <Clients />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}