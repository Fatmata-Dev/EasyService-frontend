import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCreateDemandeMutation } from "../../API/demandesApi";
import { useGetCategoriesQuery } from "../../API/servicesApi";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

export default function ReservationModal({ setShowModal, selectedService }) {
  const { user } = useAuth();
  const userData = user._id;
  const navigate = useNavigate();

  // Utilisation des hooks RTK Query
  const [createDemande, { isLoading }] = useCreateDemandeMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [formData, setFormData] = useState({
    service: selectedService?._id || "",
    serviceName: selectedService?.nom || selectedService?.service || "",
    categorie: selectedService?.categorie || "",
    description: selectedService?.description || "",
    tarif: selectedService?.tarif || 0,
    duree: selectedService?.duree || 0,
    uniteDuree: selectedService?.uniteDuree || "heures",
    technicien: selectedService?.technicien || "",
    dateIntervention: selectedService?.dateIntervention || "",
  });

  const [error, setError] = useState("");

  const calculateTarif = (duree, tarifBase) => {
    let tarifTotal = 0;
    tarifBase = Number(tarifBase) || 0;
    tarifTotal = tarifBase * duree;
    return tarifTotal;
  };

  useEffect(() => {
    if (formData.duree && formData.tarif) {
      const newTarif = calculateTarif(
        formData.duree,
        selectedService?.tarif || formData.tarif
      );
      setFormData((prev) => ({
        ...prev,
        tarif: newTarif,
      }));
    }
  }, [formData.duree, selectedService?.tarif, formData.tarif]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validations
    if (formData.duree <= 0) {
      setError("La durée doit être supérieure à 0.");
      toast.error("Durée invalide.");
      return;
    }

    if (!userData || typeof userData !== "string" || userData === "undefined") {
      setError("Identifiant client invalide");
      toast.error("Identifiant client invalide");
      return;
    }

    if (!formData.dateIntervention) {
      setError("Veuillez renseigner la date et l'heure d'intervention.");
      toast.error("Veuillez renseigner la date et l'heure d'intervention.");
      return;
    }

    const tarifNumber = Number(formData.tarif) || 0;

    const demandeData = {
      service: formData.service,
      description: formData.description,
      tarif: tarifNumber,
      duree: formData.duree,
      uniteDuree: formData.uniteDuree,
      dateIntervention: formData.dateIntervention,
      client: userData,
      status: "en_attente",
      technicien: formData.technicien || null,
      admin: null,
    };

    try {
      await createDemande(demandeData).unwrap();
      toast.success("Demande envoyée avec succès !");
      setShowModal(false);
      navigate("/client/demandes");
    } catch (err) {
      console.error("Erreur lors de l'envoi de la demande", err);
      const errorMessage = err.data?.message || "Erreur lors de l'envoi de la demande";
      setError(errorMessage);
      toast.error(errorMessage);
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
          Faire une demande
        </h3>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Service
              </label>
              <input
                disabled
                value={formData.serviceName}
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Catégorie</label>
              <select
                disabled
                value={formData.categorie}
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
              >
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.nom}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Description</label>
            <textarea
              disabled
              value={formData.description}
              className="py-2 block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Durée</label>
              <input
                name="duree"
                type="number"
                min={selectedService?.duree || 0}
                max={100}
                step="1"
                value={formData.duree}
                onChange={handleInputChange}
                required
                className="block w-full rounded px-3 py-1.5 text-base text-gray-900 border border-gray-400"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Unité de durée
              </label>
              <select
                disabled
                value={formData.uniteDuree}
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
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
                disabled
                value={formData.tarif}
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                {selectedService?.uniteDuree &&
                  `Tarif: ${selectedService?.tarif.toLocaleString()} FCFA / ${
                    selectedService?.uniteDuree
                  }`}
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Date et heure d'intervention
              </label>
              <input
                type="datetime-local"
                name="dateIntervention"
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
                disabled
                placeholder="A définir par l'admin"
                className="block w-full rounded bg-gray-200 px-3 py-1.5 text-base text-gray-900 border border-gray-400 cursor-not-allowed"
              />
            </div>
          </div>

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