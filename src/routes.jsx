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
import ServicesAdmin from './pages/Admin/ServicesAdmin';
import DashboardAdmin from './pages/Admin/Dashboard';
import ClientHome from './pages/client/Client';
import AdminHome from './pages/Admin/Admin';
import DemandesAdmin from './pages/Admin/DemandesAdmin';
import MessagesAdmin from './pages/client/Messages';
import PermissionsAdmin from './pages/Admin/Permsissions';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Page publique */}
      <Route path="/" element={<Home />} />
      
      {/* Espace client */}
      <Route path="/client" element={<ClientHome />}>
        <Route index element={<Dashboard />} /> 
        <Route path="dashboard" element={<Dashboard />} /> 
        <Route path="demandes" element={<Demands />} /> 
        <Route path="messages" element={<Messages />} />
        <Route path="services" element={<Services />} /> 
        <Route path="avis" element={<Avis />} />
        <Route path="services/:id" element={<ServiceDetail />} /> 
        <Route path="contact" element={<Contact />} /> 
      </Route>

      {/* Page 404 */}
      <Route path="*" element={<NotFound />} />

      {/* Espace Admin */}
      <Route path="/admin" element={<AdminHome />}>
        <Route index element={<DashboardAdmin />} /> 
        <Route path="dashboard" element={<DashboardAdmin />} /> 
        <Route path="services" element={<ServicesAdmin />} /> 
        <Route path="service/detail" element={<ServiceDetail />} /> 
         <Route path="demandes" element={<DemandesAdmin />} /> 
        {/* <Route path="interventions" element={<InterventionsAdmin />} /> */}
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="permissions" element={<PermissionsAdmin />} /> 
        {/*<Route path="avis" element={<Avis />} />
        <Route path="services/:id" element={<ServiceDetail />} /> */}
      </Route>
    </Routes>
  );
}