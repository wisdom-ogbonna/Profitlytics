import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Auth from './Pages/Auth';
import NotFound from './Pages/Notfound';

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}
