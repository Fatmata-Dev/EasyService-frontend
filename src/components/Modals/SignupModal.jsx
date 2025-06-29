import React, { useState } from "react";
import toast from "react-hot-toast";
import { useUserRegisterMutation } from "../../API/authApi";
import { useUserLoginWithGoogleMutation } from "../../API/authApi";
import { GoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function SignupModal({ onClose, onSwitchToLogin }) {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    terms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [register, { isLoading, isError }] = useUserRegisterMutation();
  const [loginWithGoogle] = useUserLoginWithGoogleMutation();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // if (!validateForm()) {
    //   return;
    // }

    setIsSubmitting(true);

    try {
      const jsonData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        password: formData.password,
        role: "client",
      };
      const response = await register(jsonData).unwrap();

      // console.log(response);

        toast.success("Inscription réussie !");
        onSwitchToLogin();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Erreur lors de l'inscription");
      toast.error(
        err.response?.data?.message || "Erreur lors de l'inscription"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 w-96 flex-wrap mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center uppercase">
          Inscription
        </h2>

        {(error || isError) && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}


        <div className=" w-full grid place-items-center">
          {/* Connectez-vous avec Google */}
            <GoogleLogin 
              onSuccess={credentialResponse => {
                loginWithGoogle({ token: credentialResponse.credential })
                  .unwrap()
                  .then((response) => {
                    toast.success("Inscription réussie !");
                    onSwitchToLogin();
                    //console.log(response);
                  })
                  .catch(err => {
                    console.log('Login Failed', err);
                    toast.error(err?.data?.message || 'Erreur lors de la connexion avec Google');
                    setError(err?.data?.message || 'Erreur lors de la connexion avec Google');
                  });
              }}
              onError={() => {
                console.log('Login Failed');
                toast.error('Erreur lors de la connexion avec Google');
                setError('Erreur lors de la connexion avec Google');
              }}
            />

          <p className="text-center text-gray-500 mt-2 uppercase">ou</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Prénom */}
          <div className="mb-4">
            <label htmlFor="prenom" className="block font-bold text-gray-700">
              Prénom
            </label>
            <input
              placeholder="Votre prénom"
              id="prenom"
              name="prenom"
              type="text"
              value={formData.prenom}
              onChange={handleChange}
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              required
            />
          </div>

          {/* Nom */}
          <div className="mb-4">
            <label htmlFor="nom" className="block font-bold text-gray-700">
              Nom
            </label>
            <input
              placeholder="Votre nom"
              id="nom"
              name="nom"
              type="text"
              value={formData.nom}
              onChange={handleChange}
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold text-gray-700">
              Email
            </label>
            <input
              placeholder="Votre email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              required
            />
          </div>

          {/* Mot de passe */}
          <div className="mb-4">
            <label htmlFor="password" className="block font-bold text-gray-700">
              Mot de passe
            </label>
            <div className="flex justify-center items-center relative">
              <input
                placeholder="Au moins 6 caractères"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                required
                minLength={6}
              />

                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 top-0 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
          </div>

          {/* Conditions generales */}
          <div className="flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={formData.terms}
                onChange={handleChange}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                required
              />
            </div>
            <label
              htmlFor="terms"
              className="ms-2 text-sm font-medium text-gray-700"
            >
              J'accepte les{" "}
              <a
                href="/conditions"
                className="text-orange-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                conditions générales
              </a>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-orange-500 text-white font-bold py-2 my-4 rounded ${
              (isSubmitting || isLoading)
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-600"
            }`}
          >
            {(isSubmitting || isLoading) ? "Inscription en cours..." : "S'inscrire"}
          </button>

          <p className="text-center text-gray-600">
            Vous avez déjà un compte ?{" "}
            <button
              type="button"
              className="text-orange-500 font-bold hover:text-orange-700 hover:cursor-pointer"
              onClick={onSwitchToLogin}
            >
              Se connecter
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
