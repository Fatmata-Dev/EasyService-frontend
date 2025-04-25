import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { de, fr } from "date-fns/locale";
import { memo } from "react";

const DemandesCardClient = memo(({ demande }) => {
  const navigate = useNavigate();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [feedback, setFeedback] = useState({
    note: demande.note || "",
    commentaire: demande.commentaire || "",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const statutConfig = {
    en_attente: { label: "En attente", color: "bg-yellow-500" },
    acceptee: { label: "Acceptée", color: "bg-indigo-500" },
    en_cours: { label: "En cours", color: "bg-blue-500" },
    terminee: { label: "Terminée", color: "bg-green-500" },
    annulee: { label: "Annulée", color: "bg-red-500" },
    refusee: { label: "Refusée", color: "bg-gray-500" },
  };

  const generateFacture = async (id) => {
    if (!window.confirm("Voulez-vous générer la facture ?")) return;

    try {
      const { data } = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/factures/afficher/facture/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const formData = new FormData();
      formData.append("montant", data.tarif);
      formData.append("service", data?.service?._id);
      formData.append("technicien", data?.technicien?._id);
      formData.append("client", data?.client?._id);
      formData.append("admin", "67da88347e9d8aefcaa19120");
      formData.append("refDemande", data._id);

      await axios.post(
        `https://easyservice-backend-iv29.onrender.com/api/factures/creer/facture`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success("Facture générée avec succès");
      navigate("/demandes");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de la génération de la facture"
      );
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Voulez-vous annuler cette demande ?")) return;

    try {
      await axios.put(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
        { statut: "annulee" },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      toast.success("Demande annulée avec succès");
      navigate("/client/demandes");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de l'annulation de la demande"
      );
    }
  };

  // console.log(demande);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `https://easyservice-backend-iv29.onrender.com/api/avis/ajouter`,
        {
          ...feedback,
          client: demande.clientId,
          technicien: demande.technicienId,
          service: demande.serviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success("Évaluation soumise avec succès");
      setFeedback({ note: "", commentaire: "" });
      setShowFeedbackForm(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de la soumission de l'évaluation"
      );
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const currentStatut = statutConfig[demande.statut] || statutConfig.refusee;

  return (
    <div className="border border-orange-300 p-4 rounded-lg shadow-md w-full bg-orange-50 flex flex-col">
      <h2 className="text-orange-500 font-bold text-lg mb-2 uppercase text-center">
        DEMANDE
          #{demande.numeroDemande}
      </h2>

      <div className="space-y-2 mb-4">
        <p>
          
        </p>
        <p>
          <strong className="font-semibold pe-2">SERVICE :</strong>
          <span className="text-orange-600">{demande.service}</span>
        </p>
        <p>
          <strong className="font-semibold pe-2">DATE :</strong>
          {formatDate(demande.date)}
        </p>
        <p>
          <strong className="font-semibold pe-2">TECHNICIEN :</strong>
          {`${demande.technicienPrenom} ${demande.technicienNom}`}
        </p>
        <p className="flex items-center flex-wrap">
          <strong className="font-semibold pe-2">INTERVENTION :</strong>
          {formatDate(demande.dateIntervention)}
        </p>
        <p className="flex items-center">
          <strong className="font-semibold pe-2">STATUT :</strong>
          <span
            className={`${currentStatut.color} text-white px-2 py-1 rounded-full text-sm`}
          >
            {currentStatut.label}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto">
        {["en_attente", "en_cours", "acceptee"].includes(demande.statut) && (
          
          <div className="flex justify-between gap-2 items-center mb-2 flex-wrap">
            <Link
            to={`/client/demandes/${demande._id}`}
            className="block text-center text-blue-500 hover:underline"
          >
            Plus de détails
          </Link>
            <button
              className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 w-fit"
              onClick={() => handleCancel(demande._id)}
            >
              Annuler
            </button>
            
          </div>
        )}

        {["annulee", "refusee"].includes(demande.statut) && (
          <Link
            to={`/client/demandes/${demande._id}`}
            className="block text-center text-blue-500 hover:underline"
          >
            Plus de détails
          </Link>
        )}

        {demande.statut === "terminee" && (
          <>
            <div className="flex justify-between gap-2 mb-2">
              <button
                className="bg-gray-500 text-white px-4 py-1.5 rounded hover:bg-gray-600 flex-1"
                onClick={() => generateFacture(demande._id)}
              >
                Facture
              </button>
              <button
                className={`${
                  showFeedbackForm ? "bg-gray-500" : "bg-orange-500"
                } text-white px-4 py-1.5 rounded hover:bg-orange-600 flex-1`}
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
              >
                {showFeedbackForm ? "Masquer" : "Noter"}
              </button>
            </div>

            {showFeedbackForm && (
              <form onSubmit={handleFeedbackSubmit} className="mt-2 space-y-2">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Note (1-5)
                  </label>
                  <input
                    type="number"
                    name="note"
                    min="1"
                    max="5"
                    value={feedback.note}
                    onChange={handleFeedbackChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Commentaire
                  </label>
                  <textarea
                    name="commentaire"
                    value={feedback.commentaire}
                    onChange={handleFeedbackChange}
                    className="w-full p-2 border rounded"
                    rows="2"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-1.5 rounded hover:bg-orange-600"
                >
                  Soumettre
                </button>
              </form>
            )}

            <Link
              to={`/client/demandes/${demande._id}`}
              className="block text-center mt-2 text-blue-500 hover:underline"
            >
              Plus de détails
            </Link>
          </>
        )}
      </div>
    </div>
  );
});

export default DemandesCardClient;
