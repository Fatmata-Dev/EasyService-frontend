import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ReservationModal from "../../components/Modals/ReservationModal";

const ServiceDetailsClient = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [commentaires, setCommentaires] = useState([]);
  const [nouveauCommentaire, setNouveauCommentaire] = useState("");
  const [note, setNote] = useState(5);

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
        setService(response.data);
        setCommentaires(response.data.commentaires || []);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };
    getService();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Chargement des détails du service...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <div className="text-xl font-bold mb-2">Erreur</div>
        <p>{error}</p>
        <Link
          to="/client/services"
          className="mt-4 inline-block text-orange-500 hover:underline"
        >
          Retour aux services
        </Link>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="text-center py-8">
        <div className="text-xl font-bold mb-2">Service non trouvé</div>
        <Link
          to="/client/services"
          className="mt-4 inline-block text-orange-500 hover:underline"
        >
          Retour aux services
        </Link>
      </div>
    );
  }

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

  const envoyerCommentaire = async () => {
    if (!nouveauCommentaire.trim()) {
      toast.error("Le commentaire ne peut pas être vide.");
      return;
    }

    try {
      const response = await axios.post(
        `https://easyservice-backend-iv29.onrender.com/api/services/${id}/commentaires`,
        {
          commentaire: nouveauCommentaire,
          note: Number(note),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      setCommentaires((prev) => [response.data, ...prev]);
      setNouveauCommentaire("");
      setNote(5);
      toast.success("Commentaire ajouté !");
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire :", error);
      toast.error("Erreur lors de l'envoi du commentaire.");
    }
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
        <div className="flex flex-col lg:flex-row md:justify-between gap-5 lg:gap-7 lg:gap-2">
          <div className="flex justify-center itemes-center w-1/2">
            <img
              src={service.image || "Image indisponible"}
              alt={service.nom || "Image indisponible"}
              className="max-w-full rounded-lg shadow-md"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "Image indisponible";
              }}
            />
          </div>

          <div className="flex flex-col gap-4 w-1/2">
            <div className="lg:w-full">
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

            <div className="lg:w-fit w-full">
              <div className="bg-orange-50 shadow-md p-6 rounded-lg border border-orange-100 w-full">
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
                  par l'admin{" "}
                  <strong className="text-orange-500 uppercase">
                    {service.admin?.prenom} {service.admin?.nom}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
        {showModal && (
          <ReservationModal
            setShowModal={setShowModal}
            selectedService={{
              ...service,
              categorie: service.categorie?._id || service.categorie,
            }}
            onSuccess={handleServiceCreated}
            serviceId={service._id}
          />
        )}

        <div className="mt-8 w-full">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Commentaires et notes
          </h2>

          {commentaires.length === 0 ? (
            <p className="text-gray-600">Aucun commentaire pour ce service.</p>
          ) : (
            <ul className="space-y-4">
              {commentaires.map((com, index) => (
                <li
                  key={index}
                  className="bg-white p-4 shadow rounded border border-gray-100"
                >
                  <p className="text-gray-700">{com.commentaire}</p>
                  <p className="text-sm text-orange-500 mt-1">
                    Note : {com.note} / 5
                  </p>
                  <p className="text-xs text-gray-500">
                    Par {com.utilisateur?.prenom || "Anonyme"} le{" "}
                    {new Date(com.createdAt).toLocaleDateString("fr-FR")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Laisser un commentaire</h3>
            <textarea
              value={nouveauCommentaire}
              onChange={(e) => setNouveauCommentaire(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              rows="3"
              placeholder="Écrivez votre avis ici..."
            ></textarea>
            <div className="flex items-center justify-between mt-2">
              <label className="text-gray-600">
                Note :
                <select
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="ml-2 border rounded px-2 py-1"
                >
                  {[5, 4, 3, 2, 1].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button
                onClick={envoyerCommentaire}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded"
              >
                Envoyer
              </button>
            </div>
          </div>
        </div>

        <div className=" sticky bottom-3 flex justify-center w-full">
          <button
            onClick={handleReservationClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-16 py-1 rounded transition-colors mt-2 text-center block sticky bottom-3 shadow-lg"
          >
            Réserver
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsClient;
