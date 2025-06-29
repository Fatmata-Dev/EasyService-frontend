import { Routes, Route, Navigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

// Pages pour tous
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import ServiceDetails from "../pages/ServiceDetails";
import UsersHome from "../pages/UsersHome";

// Pages pour client
import Dashboard from "../pages/client/Dashboard";
import Demands from "../pages/client/Demands";
import DetailsDemandeClient from "../pages/client/DetailsDemandeClient";
import MessagesClient from "../pages/client/Messages";
import DetailsMessageClient from "../pages/client/DetailsMessageClient";
import Services from "../pages/client/Services";
import ServiceDetailsClient from "../pages/client/ServiceDetailsClient";
import AvisClient from "../pages/client/AvisClient";
// import Contact from "../pages/client/Contact";

// Pages pour admin
import DashboardAdmin from "../pages/Admin/Dashboard";
import ServicesAdmin from "../pages/Admin/ServicesAdmin";
import ServiceDetailAdmin from "../pages/Admin/ServiceDetailAdmin";
import DemandesAdmin from "../pages/Admin/DemandesAdmin";
import DetailsDemandeAdmin from "../pages/Admin/DetailsDemandesAdmin";
import MessagesList from "../pages/Admin/MessageList";
import DetailsMessageAdmin from "../pages/Admin/DetailsMessageAdmin";
import PermissionsAdmin from "../pages/Admin/Permsissions";
import AvisAdmin from "../pages/Admin/AvisAdmin";

// Pages pour technicien
import DashboardTechniciens from "../pages/Technicien/Dashboard";
import Intervention from "../pages/Technicien/Intervention";
import InterventionDetails from "../pages/Technicien/InterventionDetails";
import MessagesTechniciens from "../pages/Technicien/Messages";
import DetailsMessageTechnicien from "../pages/Technicien/DetailsMessageTechnicien";
// import AvisTechniciens from "../pages/Technicien/Avis";
// import ContactTechniciens from "../pages/Technicien/Contact";


// Pages pour user (Admin, Technicien, Client)
import UserProfil from "../pages/UserProfil";
import Deconnexion from "../pages/Deconnexion";

// Modals
import NewPasswordModal from "../components/Modals/NewPassword";
import LoginModal from "../components/Modals/LoginModal";
import ForgetPasswordModal from "../components/Modals/ForgetPasswordModal";
import SignupModal from "../components/Modals/SignupModal";

// PrivateRoute
import PrivateRoute from "./PrivateRoute";

// Endpoints API
import { useGetUserConnetedQuery } from "../API/authApi";

import { useLocation } from "react-router-dom";
import Search from "../pages/Search";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function AppRoutes() {
  const [searchParams] = useSearchParams();
  const newPassToken = searchParams.get("newPassToken");

  const [showLogin, setShowLogin] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const { data: user } = useGetUserConnetedQuery();

  useEffect(() => {
    if (newPassToken) {
      setShowNewPassword(true);
    }
  }, [newPassToken]);

  return (
    <>
      <ScrollToTop />

      <Routes>
        {/* Route publique */}
        <Route path="/" element={<Home />} />
        <Route path="/services/:id" element={<ServiceDetails />} />
        <Route path="deconnexion" element={<Deconnexion user={user} />} />

        {/* Espace client */}
        <Route path="/client" element={ <PrivateRoute role="client"> <UsersHome /> </PrivateRoute> } >
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="demandes" element={<Demands />} />
          <Route path="demandes/:id" element={<DetailsDemandeClient />} />
          <Route path="messages" element={<MessagesClient />} />
          <Route path="messages/:id" element={<DetailsMessageClient />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:id" element={<ServiceDetailsClient />} />
          <Route path="avis" element={<AvisClient />} />
          {/* <Route path="contact" element={<Contact />} /> */}
          <Route path="profil/:id" element={<UserProfil user={user} />} />
          <Route path="search" element={<Search user={user} />} />
        </Route>

        {/* Espace admin */}
        <Route path="/admin" element={ <PrivateRoute role="admin"> <UsersHome /> </PrivateRoute> } >
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
          <Route path="profil/:id" element={<UserProfil user={user} />} />
          <Route path="search" element={<Search user={user} />} />
        </Route>

        {/* Espace technicien */}
        <Route path="/technicien" element={ <PrivateRoute role="technicien"> <UsersHome /> </PrivateRoute> } >
          <Route index element={<DashboardTechniciens />} />
          <Route path="dashboard" element={<DashboardTechniciens />} />
          <Route path="interventions" element={<Intervention />} />
          <Route path="interventions/:id" element={<InterventionDetails />} />
          <Route path="messages" element={<MessagesTechniciens />} />
          <Route path="messages/:id" element={<DetailsMessageTechnicien />} />
          {/* <Route path="avis" element={<AvisTechniciens />} /> */}
          {/* <Route path="contact" element={<ContactTechniciens />} /> */}
          <Route path="profil/:id" element={<UserProfil user={user} />} />
          <Route path="search" element={<Search user={user} />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>

      {/* Modaux */}
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
  );
}
