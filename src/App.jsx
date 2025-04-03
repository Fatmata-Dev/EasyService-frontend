import React from "react";
import AppRoutes from "./Routes/routes";
import ErrorBoundary from "./components/ErrorBoundary";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
    </div>
  );
}
