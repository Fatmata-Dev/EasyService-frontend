import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddTechnicienModal({ setShowModal }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    metier: "",
    categorie: "",
    email: "",
    password: "passer",
    role: "technicien", // Ajout du champ de rôle
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("prenom", formData.prenom);
      data.append("nom", formData.nom);
      data.append("telephone", formData.telephone);
      data.append("metier", formData.metier);
      data.append("categorie", formData.categorie);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("role", formData.role);

      const response = await axios.post(
        "https://easyservice-backend-iv29.onrender.com/api/auth/creer/technicien",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        setShowModal(false);
        toast.success(response?.data?.message);
        setError(response?.data?.message);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'enregistrement"
      );
      toast.error(
        err.response?.data?.message || "Erreur lors de l'enregistrement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const getAllCategories = async () => {
      try {
        const response = await axios.get(
          "https://easyservice-backend-iv29.onrender.com/api/categories/all/categories",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Erreur lors de la récupération des catégories", err);
      }
    };

    getAllCategories();
  }, []);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 min-w-[200px] w-[800px] m-5 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="uppercase border-b-2 border-dashed w-full mb-2 font-bold text-xl text-orange-500 text-center">
          Ajouter un technicien
        </h3>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <h4 className="font-bold text-gray-700 mb-2">
            Informations personnel
          </h4>
          {/* Prénom et Nom */}
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Prénom
              </label>
              <input
                id="prenom"
                name="prenom"
                type="text"
                value={formData.prenom}
                onChange={handleInputChange}
                required
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Nom
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleInputChange}
                required
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Téléphone & Métier */}
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Téléphone
              </label>
              <input
                id="telephone"
                name="telephone"
                type="text"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Métier
              </label>
              <input
                id="metier"
                name="metier"
                type="text"
                value={formData.metier}
                onChange={handleInputChange}
                required
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Catégorie */}
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Catégorie
              </label>
              <select
                id="categorie"
                name="categorie"
                value={formData.categorie}
                onChange={handleInputChange}
                required
                className="py-2 block w-full rounded bg-white px-1.5 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              >
                {categories.length > 0 ? (
                  categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.nom}
                    </option>
                  ))
                ) : (
                  <option value="">Chargement...</option>
                )}
              </select>
            </div>
          </div>

          <h4 className="font-bold text-gray-700 my-2">
            Informations de connexion
          </h4>
          {/* Prénom et Nom */}
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block text-sm font-medium text-gray-500">
                Mot de passe (Par défaut)
              </label>
              <input
                id="password"
                name="password"
                value={formData.password}
                readOnly
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>
          </div>

          {/* Bouton d'enregistrement */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-fit bg-orange-500 text-white font-bold py-2 px-4 rounded ${
                isLoading
                  ? "bg-orange-400 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
            >
              {isLoading ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
