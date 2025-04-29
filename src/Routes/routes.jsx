import { Routes, Route } from "react-router-dom";
// import PrivateRoute from "./PrivateRoute";
// import AuthProvider from "../context/AuthProvider";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ClientHome from "../pages/client/Client";
import Dashboard from "../pages/client/Dashboard";
import Demands from "../pages/client/Demands";
import MessagesClient from "../pages/client/Messages";
import Services from "../pages/client/Services";
import AvisClient from "../pages/client/AvisClient";
import Contact from "../pages/client/Contact";
import ServiceDetailsClient from "../pages/client/ServiceDetailsClient";
import AdminHome from "../pages/Admin/Admin";
import DashboardAdmin from "../pages/Admin/Dashboard";
import ServicesAdmin from "../pages/Admin/ServicesAdmin";
import ServiceDetailAdmin from "../pages/Admin/ServiceDetailAdmin";
import DemandesAdmin from "../pages/Admin/DemandesAdmin";
import MessagesList from "../pages/Admin/MessageList";
import PermissionsAdmin from "../pages/Admin/Permsissions";
import AvisAdmin from "../pages/Admin/AvisAdmin";
import DashboardTechniciens from "../pages/Technicien/Dashboard";
import Intervention from "../pages/Technicien/Intervention";
import InterventionDetails from "../pages/Technicien/InterventionDetails";
import MessagesTechniciens from "../pages/Technicien/Messages";
import AvisTechniciens from "../pages/Technicien/Avis";
import ContactTechniciens from "../pages/Technicien/Contact";
import TechnicienHome from "../pages/Technicien/Technicien";
import ServiceDetails from "../pages/ServiceDetails";
import DetailsDemandeClient from "../pages/client/DetailsDemandeClient";
import DetailsDemandeAdmin from "../pages/Admin/DetailsDemandesAdmin";
import DetailsMessageClient from "../pages/client/DetailsMessageClient";
import DetailsMessageAdmin from "../pages/Admin/DetailsMessageAdmin";
import DetailsMessageTechnicien from "../pages/Technicien/DetailsMessageTechnicien";
import { useSearchParams } from "react-router-dom";
import NewPasswordModal from "../components/Modals/NewPassword";
import { useState, useEffect } from "react";
import LoginModal from "../components/Modals/LoginModal";
import ForgetPasswordModal from "../components/Modals/ForgetPasswordModal";
import SignupModal from "../components/Modals/SignupModal";

export default function AppRoutes() {
  const [searchParams] = useSearchParams();
  const newPassToken = searchParams.get("newPassToken");

  const [showLogin, setShowLogin] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  useEffect(() => {
    if (newPassToken) {
      setShowNewPassword(true);
    }
  }, [newPassToken]);

  return (
    // <AuthProvider>
    <>
      <Routes>
        {/* Page publique */}
        <Route path="/" element={<Home />} />
        <Route path="/services/:id" element={<ServiceDetails />} />

        {/* Routes privées selon le rôle */}
        {/* Espace client */}
        {/* <Route element={<PrivateRoute role="client" />}> */}
        <Route path="/client" element={<ClientHome />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="demandes" element={<Demands />} />
          <Route path="demandes/:id" element={<DetailsDemandeClient />} />
          <Route path="messages" element={<MessagesClient />} />
          <Route path="messages/:id" element={<DetailsMessageClient />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetailsClient />} />
          <Route path="avis" element={<AvisClient />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        {/* </Route> */}

        {/* Espace Admin */}
        {/* <Route element={<PrivateRoute role="admin" />}> */}
        <Route path="/admin" element={<AdminHome />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="dashboard" element={<DashboardAdmin />} />
          <Route path="services" element={<ServicesAdmin />} />
          <Route path="services/:id" element={<ServiceDetailAdmin />} />
          <Route path="demandes" element={<DemandesAdmin />} />
          <Route path="demandes/:id" element={<DetailsDemandeAdmin />} />
          <Route path="messages" element={<MessagesList />} />
          <Route path="messages/:id" element={<DetailsMessageAdmin />} />
          <Route path="permissions" element={<PermissionsAdmin />} />
          <Route path="avis" element={<AvisAdmin />} />
        </Route>
        {/* </Route> */}

        {/* Espace technicien */}
        {/* <Route element={<PrivateRoute role="technicien" />}> */}
        <Route path="/technicien" element={<TechnicienHome />}>
          <Route index element={<DashboardTechniciens />} />
          <Route path="dashboard" element={<DashboardTechniciens />} />
          <Route path="interventions" element={<Intervention />} />
          <Route path="interventions/:id" element={<InterventionDetails />} />
          <Route path="messages" element={<MessagesTechniciens />} />
          <Route path="messages/:id" element={<DetailsMessageTechnicien />} />
          <Route path="avis" element={<AvisTechniciens />} />
          <Route path="contact" element={<ContactTechniciens />} />
        </Route>
        {/* </Route> */}

        {/* Page 404 - Doit être placée en dernier */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {showNewPassword && (
        <NewPasswordModal
          onClose={() => setShowNewPassword(false)}
          onSwitchToLogin={() => {
            setShowNewPassword(false);
            setShowLogin(true);
          }}
        />
      )}
      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onSwitchToForgetPassword={() => {
            setShowLogin(false);
            setShowForgetPassword(true);
          }}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
      {showForgetPassword && (
        <ForgetPasswordModal
          onClose={() => setShowForgetPassword(false)}
          onSwitchToLogin={() => {
            setShowForgetPassword(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
    // </AuthProvider>
  );
}
