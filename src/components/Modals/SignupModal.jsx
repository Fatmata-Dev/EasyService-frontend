import React from "react";
import { useState } from "react";
import axios from "axios";

export default function SignupModal({ onClose, onSwitchToLogin }) {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const role = "client";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nomError = document.querySelector(".nom.error");
    const emailError = document.querySelector(".email.error");
    const passwordError = document.querySelector(".password.error");
    // const termsError = document.querySelector(".terms.error");
    // const terms = document.getElementById("terms");

    // termsError.innerHTML = "";

    // if (!terms.checked)
    //   termsError.innerHTML = "Veuillez valider les conditions générales";

    await axios
      .post(
        `https://easyservice-backend-iv29.onrender.com/api/auth/register`,
        {
          prenom,
          nom,
          email,
          password,
          role,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      )
      .then((res) => {
        // console.log(res);
        if (res.data.errors) {
          if (res.data.errors.nom) nomError.innerHTML = res.data.errors.nom;
          if (res.data.errors.email)
            emailError.innerHTML = res.data.errors.email;
          if (res.data.errors.password)
            passwordError.innerHTML = res.data.errors.password;
        } else {
          window.location("/client/dashboard", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6 text-center uppercase">
          Inscription
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="prenom" className="block font-bold text-gray-700">
              Prénom
            </label>
            <input
              placeholder="Votre prénom"
              id="prenom"
              name="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="nom" className="block font-bold text-gray-700">
              Nom
            </label>
            <input
              placeholder="Votre prénom et nom"
              id="nom"
              name="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>
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
            />
          </div>
          <div className="flex items-center mb-4">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
            />
            <label
              htmlFor="terms"
              className="ms-2 text-md font-medium text-gray-700"
            >
              J'accepte les{" "}
              <a href="#" className="text-blue-600 hover:underline">
                termes et la politique
              </a>
              .
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-2 my-4 rounded hover:bg-orange-600"
          >
            Sinscrire
          </button>
          <p>
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
