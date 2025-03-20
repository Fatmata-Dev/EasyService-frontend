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
import ServicesAdmin from './pages/Admin/Services';
import DashboardAdmin from './pages/Admin/Dashboard';
import ServicesModal from './components/Modals/ServicesModal';
import ClientHome from './pages/client/Client';

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
      <Route path="/admin/Dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/Demandes" element={<ServicesAdmin />} />
      <Route path="/Modal" element={<ServicesModal />} />

      {/* Espace Admin */}
      <Route path="/admin" element={<ClientHome />}>
        <Route index element={<Dashboard />} /> 
        <Route path="dashboard" element={<DashboardAdmin />} /> 
        <Route path="services" element={<ServicesAdmin />} /> 
        {/* <Route path="demandes" element={<DemandsAdmin />} /> 
        <Route path="interventions" element={<MessagesAdmin />} />
        <Route path="messages" element={<MessagesAdmin />} />
        <Route path="permissions" element={<PermissionsAdmin />} /> 
        <Route path="avis" element={<Avis />} />
        <Route path="services/:id" element={<ServiceDetail />} /> */}
      </Route>
    </Routes>
  );
}