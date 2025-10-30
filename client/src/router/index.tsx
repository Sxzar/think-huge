import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Protected from '../components/Protected';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <Protected><Dashboard /></Protected>
        } />
      </Routes>
    </BrowserRouter>
  );
}