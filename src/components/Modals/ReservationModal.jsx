import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import React from "react";
import ServicesModal from "./ServicesModal";

export default function ReservationModal({ setShowModal, selectedService }) {
  const [showModalReservation, setShowModalReservation] = useState(false);
  const [service, setService] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const user = userData?.id;
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nom: selectedService?.nom || "",
    description: selectedService?.description || "",
    tarif: selectedService?.tarif || "",
    duree: selectedService?.duree || "",
    uniteDuree: selectedService?.uniteDuree || "",
    categorie: selectedService?.categories || "",
    client: user,
    dateIntervention: "",
    technicien: "",
    status: "en_attente",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Fonction pour calculer le tarif
  const calculateTarif = (duree) => {
    const tarifParMinutes = 50; // 1 heure = 5000 FCFA
    const total = duree * tarifParMinutes;
    setFormData((prev) => ({
      ...prev,
      duree: duree,
      tarif: total,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "duree") {
      calculateTarif(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!user || typeof user !== "string" || user === "undefined") {
      setError("Identifiant administrateur invalide");
      toast.error("Identifiant administrateur invalide");
      setIsLoading(false);
      return;
    }

    if (!formData.dateIntervention) {
      setError("Veuillez renseigner la date et l'heure d'intervention.");
      toast.error("Veuillez renseigner la date et l'heure d'intervention.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://easyservice-backend-iv29.onrender.com/api/reservations",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success("Demande envoyée avec succès !");
      console.log(response);
      setShowModal(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande", err);
      toast.error("Erreur lors de l'envoi de la demande");
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
          Faire une demande
        </h3>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            {/* Nom du service */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Nom du Service
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                disabled
                value={formData.nom}
                className="py-2 block w-full rounded-md bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Catégorie</label>
              <select
                name="categorie"
                id="categorie"
                value={formData.categorie}
                disabled
                onChange={handleInputChange}
                className="py-2 block w-full rounded-md bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
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
          {/* Description */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              disabled
              value={formData.description}
              className="py-2 block w-full rounded-md bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Durée</label>
              <input
                placeholder="Donnez la durée en nombre"
                id="duree"
                name="duree"
                type="number"
                min="1"
                value={formData.duree}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Unité de durée
              </label>
              <select
                name="uniteDuree"
                id="uniteDuree"
                readOnly
                value={formData.uniteDuree}
                onChange={handleInputChange}
                required
                className="py-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              >
                <option value={"Heures"}>Heures</option>
                <option value={"Jours"}>Jours</option>
                <option value={"Mois"}>Mois</option>
              </select>
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Tarif (XOF)
              </label>
              <input
                placeholder="Ex: 20000"
                id="tarif"
                name="tarif"
                type="number"
                disabled
                value={formData.tarif}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Date d'intervention
              </label>
              <input
                // placeholder="Entrez le Date d'intervention"
                id="dateIntervention"
                name="dateIntervention"
                type="datetime-local"
                value={formData.dateIntervention}
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Technicien
              </label>
              <input
                id="technicien"
                name="technicien"
                type="text"
                disabled
                placeholder="A définir par l'admin"
                onChange={handleInputChange}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6 cursor-not-allowed"
              />
            </div>
          </div>

          {showModalReservation && (
            <ServicesModal
              setShowModalReservation={setShowModalReservation}
              selectedService={{
                ...service,
                categorie: service.categorie?._id || service.categorie, // S'assurer de passer l'ID
              }}
              isEditing={true}
            />
          )}

          {/* Bouton envoyer */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
              disabled={isLoading}
            >
              {isLoading ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
