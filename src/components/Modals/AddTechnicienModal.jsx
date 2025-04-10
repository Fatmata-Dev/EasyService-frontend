import { useState } from "react";
import axios from "axios";

export default function AddTechnicienModal({ setShowModal }) {
  const [imagePreview, setImagePreview] = useState("");
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    description: "",
    image: null,
    role: "technicien", // Ajouter un champ de rôle
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const data = new FormData();
      data.append("prenom", formData.prenom);
      data.append("nom", formData.nom);
      data.append("email", formData.email);
      data.append("description", formData.description);
      data.append("role", formData.role);
      data.append("image", formData.image);

      const response = await axios.post(
        "http://localhost:4000/api/techniciens/ajouter", // URL à ajuster en fonction du backend
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        setShowModal(false);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Erreur lors de l'enregistrement"
      );
    } finally {
      setIsLoading(false);
    }
  };

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
          {/* Prénom */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Prénom</label>
            <input
              placeholder="Entrez le prénom"
              id="prenom"
              name="prenom"
              type="text"
              value={formData.prenom}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>

          {/* Nom */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Nom</label>
            <input
              placeholder="Entrez le nom"
              id="nom"
              name="nom"
              type="text"
              value={formData.nom}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>

          {/* Email */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Email</label>
            <input
              placeholder="Entrez l'email"
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>

          {/* Description */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Description</label>
            <textarea
              placeholder="Mettez la description"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
            />
          </div>

          {/* Image */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Image</label>
            <div className="flex justify-center items-center w-full h-[200px] border border-gray-400 rounded relative">
              <div className="w-fit flex flex-col justify-center items-center">
                <input
                  type="file"
                  name="image"
                  id="image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="opacity-0 h-[70px] absolute cursor-pointer z-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="62"
                  height="47"
                  viewBox="0 0 62 47"
                  fill="none"
                >
                  <path
                    d="M55.7776 46.3738H6.21618C3.05783 46.3738 0.497559 43.8135 0.497559 40.6552V6.34344C0.497559 3.18509 3.05783 0.624817 6.21618 0.624817H55.7776C58.9359 0.624817 61.4962 3.18509 61.4962 6.34344V40.6552C61.4962 43.8135 58.9359 46.3738 55.7776 46.3738ZM13.841 7.29654C10.1563 7.29654 7.16929 10.2836 7.16929 13.9683C7.16929 17.653 10.1563 20.64 13.841 20.64C17.5257 20.64 20.5127 17.653 20.5127 13.9683C20.5127 10.2836 17.5257 7.29654 13.841 7.29654ZM8.12239 38.749H53.8714V25.4055L43.445 14.9792C42.8867 14.4209 41.9815 14.4209 41.4231 14.9792L25.2783 31.1241L18.6643 24.5102C18.106 23.9519 17.2008 23.9519 16.6424 24.5102L8.12239 33.0303V38.749Z"
                    fill="#BDBDBD"
                  />
                </svg>
                <p>Ajoutez une image</p>
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-[200px] object-cover absolute"
                />
              )}
            </div>
          </div>

          {/* Bouton d'enregistrement */}
          <div className="flex justify-end">
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
