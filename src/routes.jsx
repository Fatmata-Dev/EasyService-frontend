// src/routes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Dashboard from './pages/client/Dashboard';
import Demands from './pages/client/Demands';
import Messages from './pages/client/Messages';
import Services from './pages/client/Services';
import Avis from './pages/client/Avis';
import Contact from './pages/client/Contact';
import ServiceDetail from './pages/client/ServiceDetail';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Page publique */}
      <Route path="/" element={<Home />} />
      
      {/* Espace client */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Demands />} /> 
        <Route path="demandes" element={<Demands />} /> 
        <Route path="messages" element={<Messages />} />
        <Route path="services" element={<Services />} /> 
        <Route path="avis" element={<Avis />} />
        <Route path="services/:id" element={<ServiceDetail />} /> 
        <Route path="contact" element={<Contact />} /> 
      </Route>

      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}