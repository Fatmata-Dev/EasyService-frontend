import React from "react";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function NewPasswordModal({ onClose, onSwitchToLogin }) {
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const password = e.target.password.value;
    const confirmPass = e.target.confirmPass.value;
    const token = new URLSearchParams(window.location.search).get(
      "newPassToken"
    );

    if (password !== confirmPass) {
      setError("Les mots de passe ne correspondent pas.");
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await axios.post(
        "https://easyservice-backend-iv29.onrender.com/api/auth/reset-password",
        { token, newPassword: password },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Supprimer le token de l'URL sans recharger la page
      if (window.history.replaceState) {
        const newUrl = window.location.pathname; // Garde le chemin sans les query params
        window.history.replaceState({}, document.title, newUrl);
      }

      alert(response.data.message);
      onClose(); // Fermer la modale après le changement de mot de passe
      toast.success("Mot de passe changé avec succès !");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Erreur lors du changement de mot de passe";
      setError(errorMsg);
      toast.error(errorMsg);
      console.error("Erreur lors du changement de mot de passe :", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 w-96 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg text-center uppercase mb-3">
          Changement de mot de passe
        </h3>
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="password" className="block font-bold text-gray-700">
              Mot de passe
            </label>
            <input
              placeholder="Votre nouveau mot de passe"
              id="password"
              name="password"
              type="password"
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>
          <div className="mb-2">
            <label
              htmlFor="confirmPass"
              className="block font-bold text-gray-700"
            >
              Confirmation du mot de passe
            </label>
            <input
              placeholder="Confirmez votre mot de passe"
              id="confirmPass"
              name="confirmPass"
              type="password"
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 my-4 rounded hover:bg-orange-600"
          >
            Envoyer
          </button>
          <div className="flex justify-center">
            <p>
              Revenir à la page de{" "}
              <button
                type="button"
                className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
                onClick={() => onSwitchToLogin(true)}
              >
                connexion
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
