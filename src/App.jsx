// src/App.jsx
import { Link } from "react-router-dom";
import AppRoutes from "./Routes/routes";
import { Toaster } from "react-hot-toast";
import AuthProvider from "./context/authProvider";

export default function App() {
  return (
    <div>
      <AuthProvider>
        <Toaster position="top-right" reverseOrder={false} />

        {/* Contenu des routes */}
        <AppRoutes />
      </AuthProvider>
    </div>
  );
}
