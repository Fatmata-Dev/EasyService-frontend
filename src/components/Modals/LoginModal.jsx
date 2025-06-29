import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useUserLoginMutation } from "../../API/authApi";
import { useUserLoginWithGoogleMutation } from "../../API/authApi";
import { GoogleLogin } from '@react-oauth/google';
import { FiEye, FiEyeOff } from "react-icons/fi";

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
  const [loginMutation] = useUserLoginMutation();
  const [loginWithGoogle] = useUserLoginWithGoogleMutation();
  const [, setToken] = useState(localStorage.getItem("authToken") || "");
  const [showPassword, setShowPassword] = useState(false);
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
       // 1. Appel de l'API de login
       const response = await loginMutation(jsonData).unwrap();
       const { token: newToken } = response;

      //  console.log(response);
   
       // 2. Stockage du token
       localStorage.setItem("authToken", newToken);
       setToken(newToken);
      localStorage.setItem('mess', "message");
       
       if (isConnected && (response.user.role === "client" || response.user.role === "admin")) {
         navigate(`/${response.user.role}/services/${id}`);
        } else {
          navigate(`/${response.user.role}/dashboard`);
        }
      window.location.reload();


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
        <h2 className="text-2xl font-bold mb-4 text-center uppercase">
          Connexion
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className=" w-full grid place-items-center">
          <GoogleLogin
            onSuccess={credentialResponse => {
              loginWithGoogle({ token: credentialResponse.credential })
                .unwrap()
                .then((response) => {
                  localStorage.setItem("authToken", response.tokenJwt);
                  setToken(response.tokenJwt);
                  
                  if (isConnected && (response.user.role === "client" || response.user.role === "admin")) {
                    navigate(`/${response.user.role}/services/${id}`);
                  } else {
                    navigate(`/${response.user.role}/dashboard`);
                  }
                  window.location.reload();
                  onClose();
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
            <div className="flex items-center justify-center relative">
              <input
                placeholder="Votre Mot de passe"
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                required
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
