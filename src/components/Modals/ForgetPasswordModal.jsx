import React from "react";

export default function ForgetPasswordModal({ onClose, onSwitchToLogin }) {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-lg">Mot de passe oublié ?</h3>
        <form>
          <p className="my-2">
            Entrez votre adresse e-mail ci-dessous et nous vous enverrons des instructions pour
            modifier votre mot de passe.
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
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
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