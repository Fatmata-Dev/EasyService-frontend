import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginModal({
  onClose,
  onSwitchToSignup,
  onSwitchToForgetPassword,
  message,
}) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
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
      const jsonData = { email, password };
      await login(jsonData);

      onClose(); // Fermer la modale après connexion
    } catch (err) {
      console.error(err);
      setError(err || "Échec de la connexion");
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
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
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
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
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
