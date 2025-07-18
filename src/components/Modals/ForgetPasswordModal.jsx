import React from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useForgotPasswordMutation } from "../../API/authApi";

export default function ForgetPasswordModal({ onClose, onSwitchToLogin }) {
  const [forgotPassword, { isLoading, isError }] = useForgotPasswordMutation();
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    try {
      const response = await forgotPassword({ email }).unwrap();
      // alert(response?.data?.message);
      onClose(); // Fermer la modale après l'envoi de l'email
      toast.success(response?.data?.message || "Email de réinitialisation envoyé avec succès !");
    } catch (error) {
      console.error( error?.data?.message ||
        "Erreur lors de l'envoi de l'email de réinitialisation :",
        error
      );
      setError(error?.data?.message || "Erreur lors de l'envoi de l'email de réinitialisation");
      toast.error(error?.data?.message || "Erreur lors de l'envoi de l'email de réinitialisation");
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
        <h3 className="font-bold text-lg">Mot de passe oublié ?</h3>
        {(error || isError) && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <p className="my-2">
            Entrez votre adresse e-mail ci-dessous et nous vous enverrons des
            instructions pour modifier votre mot de passe.
          </p>
          <div className="mb-2">
            <label htmlFor="email" className="block font-bold text-gray-700">
              Email
            </label>
            <input
              placeholder="Votre email"
              id="email"
              name="email"
              type="email"
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>
          <button
            disabled={isLoading}
            type="submit"
            className={`w-full bg-orange-500 text-white cursor-pointer font-bold py-2 my-4 rounded ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-600"
            }`}
          >
            {isLoading ? "Envoi en cours..." : "Envoyer"}
          </button>
          <div className="flex justify-center">
            <p>
              Revenir à la page de{" "}
              <button
                type="button"
                className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
                onClick={onSwitchToLogin}
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
