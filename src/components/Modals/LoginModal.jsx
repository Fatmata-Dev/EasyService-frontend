import React from "react";

export default function LoginModal({ onClose, onSwitchToSignup, onSwitchToForgetPassword }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center uppercase">Connexion</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="email" className="block font-bold text-gray-700">
              Email
            </label>
            <input
              placeholder="Votre email"
              id="email"
              name="email"
              type="email"
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
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
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white cursor-pointer font-bold py-2 my-4 rounded hover:bg-orange-600"
          >
            Se connecter
          </button>
          <div className="flex justify-between">
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