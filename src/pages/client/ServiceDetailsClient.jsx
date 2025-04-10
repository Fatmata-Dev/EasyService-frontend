import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ReservationModal from "../../components/Modals/ReservationModal";

const ServiceDetailsClient = () => {
  const { id } = useParams(); // Récupère l'ID du Service depuis l'URL
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getService = async () => {
      try {
        const response = await axios.get(
          `https://easyservice-backend-iv29.onrender.com/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        // console.log("Structure complète des données:", {
        //   data: response.data,
        //   admin: response.data.admin,
        //   isObject: typeof response.data.admin === "object",
        //   keys: response.data.admin ? Object.keys(response.data.admin) : null,
        // });
        // console.log("Données du service:", response.data.nom);
        setService(response.data);
      } catch (err) {
        // console.error("Erreur complète:", err.response?.data);
        setError(err.response?.data?.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };
    getService();
  }, [id]);

  if (loading)
    return <div className="text-center py-8">Chargement en cours...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!service)
    return <div className="text-center py-8">Service non trouvé</div>;

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return "Date non spécifiée";
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleServiceCreated = (newService) => {
    setService((prev) => [...prev, newService]);
    setShowModal(false);
  };

  const handleReservationClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  return (
    <div className="container mx-auto px-4">
      <Link
        to="/client/services"
        className="text-gray-700 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
      >
        Retour
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">DÉTAIL DU SERVICE</h1>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <img
            src={service.image || "Image indisponible"}
            alt={service.nom || "Image indisponible"}
            className="max-w-full sm:max-w-lg rounded-lg shadow-md h-[300px]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "Image indisponible";
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold mb-2 text-orange-500">
              {service.nom?.toUpperCase()}
            </h2>
            <p className="text-gray-700 mb-4 font-semibold">
              {service.categorie?.nom || "Catégorie non spécifiée"}
            </p>

            <p className="text-gray-700 whitespace-pre-line">
              {service.description || "Aucune description disponible"}
            </p>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-orange-50 shadow-md p-6 rounded-lg border border-orange-100">
              <p className="mb-3">
                <strong>TARIF :</strong>{" "}
                {service.tarif ? `${service.tarif} FCFA` : "Non spécifié"}
              </p>
              <p className="mb-3">
                <strong>DUREE :</strong>{" "}
                {service.duree
                  ? `${service.duree} ${service.uniteDuree || ""}`
                  : "Non spécifiée"}
              </p>
              <p className="mb-3">
                <strong>DATE INTERVENTION :</strong>{" "}
                {formatDate(service.dateIntervention)}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Ajouté le{" "}
                {service.createDate
                  ? new Date(service.createDate).toLocaleDateString("fr-FR")
                  : "date inconnue"}{" "}
                par l&apos;admin{" "}
                <strong className="text-orange-500 uppercase">
                  {service.admin?.prenom} {service.admin?.nom}
                </strong>
              </p>
            </div>
          </div>
        </div>
        {showModal && (
          <ReservationModal
            setShowModal={setShowModal}
            selectedService={{
              ...service,
              categorie: service.categorie?._id || service.categorie, // S'assurer de passer l'ID
            }}
            onSuccess={handleServiceCreated}
            serviceId={service._id} // Passez l'ID du service au modal
          />
        )}
        <div className="flex justify-center w-full">
          <button
            onClick={handleReservationClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded transition-colors mt-2 text-center block sticky bottom-3 shadow-lg"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsClient;
