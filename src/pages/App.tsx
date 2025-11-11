// App.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Landing from './Landing';
import Menu from './Menu';
import Dashboard from './Dashboard';
import Login from './login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Landing />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/dashboard/*" element={<Dashboard />}/>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
