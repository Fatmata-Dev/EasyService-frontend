import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

export default function LoginModal({
  onClose,
  onSwitchToSignup,
  onSwitchToForgetPassword,
  message,
  isConnected,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (message) {
      setError(message);
      toast.error(message);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://easyservice-backend-iv29.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if ((response.data.token && response.data.user.role) || isConnected) {
        if (isConnected) {
          navigate(`/${response.data.user.role}/services/${id}`);
        } else {
          navigate(`/${response.data.user.role}/dashboard`);
        }
      }
      console.log(response.data);

      onClose(); // Fermer la modale après connexion
    } catch (err) {
      setError(err.response?.data?.message || "Échec de la connexion");
    } finally {
      setIsLoading(false);
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
        <h2 className="text-2xl font-bold mb-6 text-center uppercase">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold text-gray-700">
              Email
            </label>
            <input
              placeholder="Votre email"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block font-bold text-gray-700">
              Mot de passe
            </label>
            <input
              placeholder="Votre Mot de passe"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-orange-500 text-white cursor-pointer font-bold py-2 my-4 rounded ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-orange-600"
            }`}
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>

          <div className="flex justify-between flex-wrap">
            <button
              type="button"
              className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
              onClick={onSwitchToSignup}
            >
              Inscription
            </button>
            <button
              type="button"
              className="text-orange-500 font-bold hover:cursor-pointer hover:text-orange-700"
              onClick={onSwitchToForgetPassword}
            >
              Mot de passe oublié ?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
