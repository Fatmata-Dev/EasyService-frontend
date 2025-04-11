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
  //const serviceId = selectedService?._id;
  const [categories, setCategories] = useState([]);

  // Tarifs de base
  const TARIF_MINUTES = 50; // 50 FCFA par minutes
  const TARIF_HORAIRE = 3000; // 3000 FCFA par heure
  const TARIF_QUOTIDIEN = 30000; // 30000 FCFA par jour (6 heures de travail)

  // Fonction pour calculer le tarif en fonction de l'unité de durée
  const calculateTarif = (duree, uniteDuree) => {
    const dureeNum = Number(duree) || 0;
    let total = 0;

    if (uniteDuree === "minutes") {
      total = Math.ceil(dureeNum) * TARIF_MINUTES;
    } else if (uniteDuree === "heures") {
      total = Math.ceil(dureeNum) * TARIF_HORAIRE;
    } else if (uniteDuree === "jours") {
      total = Math.ceil(dureeNum) * TARIF_QUOTIDIEN;
    }

    return total;
  };

  const [formData, setFormData] = useState({
    service: selectedService?._id || "",
    serviceName: selectedService?.nom || selectedService?.service || "", // Pour l'affichage
    //categorie: selectedService?.categories || "",
    description: selectedService?.description || "",
    tarif: selectedService?.tarif || 0,
    duree: selectedService?.duree || 0,
    uniteDuree: selectedService?.uniteDuree || "heures",
    technicien: selectedService?.technicien || "",
    //status: selectedService ||"en_attente",
    //client: selectedService || user,
    dateIntervention: selectedService?.dateIntervention || "",
  });
  //console.log(formData.tarif);

  useEffect(() => {
    if (formData.duree && formData.uniteDuree) {
      const newTarif = calculateTarif(formData.duree, formData.uniteDuree);
      setFormData((prev) => ({
        ...prev,
        tarif: newTarif,
      }));
    }
  }, [formData.duree, formData.uniteDuree]);

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

    if (!user || typeof user !== "string" || user === "undefined") {
      setError("Identifiant client invalide");
      toast.error("Identifiant client invalide");
      setIsLoading(false);
      return;
    }

    // Vérifiez que le tarif est bien un nombre
    if (typeof formData.tarif !== "number") {
      setError("Le calcul du tarif a échoué");
      toast.error("Erreur dans le calcul du tarif");
      return;
    }

    if (!formData.dateIntervention) {
      setError("Veuillez renseigner la date et l'heure d'intervention.");
      toast.error("Veuillez renseigner la date et l'heure d'intervention.");
      setIsLoading(false);
      return;
    }

    const tarifNumber = Number(formData.tarif) || 0;

    // Préparer les données pour l'API demande
    const demandeData = {
      service: formData.service,
      description: formData.description,
      tarif: tarifNumber,
      duree: formData.duree,
      uniteDuree: formData.uniteDuree,
      dateIntervention: formData.dateIntervention,
      client: user, // Ajout du client
      status: "en_attente", // Ajout du statut par défaut
      technicien: formData.technicien || null,
    };

    console.log("Données à envoyer:", demandeData);

    try {
      const response = await axios.post(
        "https://easyservice-backend-iv29.onrender.com/api/demandes",
        demandeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success("Demande envoyée avec succès !");
      console.log("Réponse de l'API:", response.data);
      setShowModal(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande", err);
      let errorMessage = "Erreur lors de l'envoi de la demande";

      if (err.response) {
        // Si l'API renvoie une réponse avec un message d'erreur
        errorMessage = err.response.data.message || errorMessage;
        console.error("Détails de l'erreur:", err.response.data);
      }

      setError(errorMessage);
      toast.error(errorMessage);
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
            {/* service du service */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                service du Service
              </label>
              <input
                id="service"
                name="service"
                type="text"
                disabled
                value={formData.serviceName}
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
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
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
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
              type="text"
              disabled
              value={formData.description}
              className="py-2 block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Durée</label>
              <input
                id="duree"
                name="duree"
                type="number"
                min="1"
                step="1"
                value={formData.duree}
                onChange={handleInputChange}
                required
                className="block w-full rounded-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Unité de durée
              </label>
              <select
                name="uniteDuree"
                id="uniteDuree"
                value={formData.uniteDuree}
                onChange={handleInputChange}
                required
                className="py-2 block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              >
                <option value="minutes">Minutes</option>
                <option value="heures">Heures</option>
                <option value="jours">Jours</option>
              </select>
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Tarif (XOF)
              </label>
              <input
                id="tarif"
                name="tarif"
                type="number"
                disabled
                value={formData.tarif}
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.uniteDuree === "heures" &&
                  `Tarif: ${TARIF_HORAIRE.toLocaleString()} FCFA/heure`}
                {formData.uniteDuree === "jours" &&
                  `Tarif: ${TARIF_QUOTIDIEN.toLocaleString()} FCFA/jour (24 heures)`}
                {formData.uniteDuree === "minutes" &&
                  `Tarif: ${Math.ceil(TARIF_HORAIRE / 60)} FCFA/minute`}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Date et heure d'intervention
              </label>
              <input
                // placeholder="Entrez le Date d'intervention"
                id="dateIntervention"
                name="dateIntervention"
                type="datetime-local"
                value={formData.dateIntervention}
                onChange={handleInputChange}
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
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
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
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
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded"
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
