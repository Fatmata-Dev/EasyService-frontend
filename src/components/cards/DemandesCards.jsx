import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import AssignTechnicienModal from "../Modals/AssignerTechnicienModal";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { memo } from "react";

const DemandesCard = memo(({ demande, onUpdate }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const statusConfig = {
    en_attente: { label: "En attente", color: "bg-yellow-500" },
    acceptee: { label: "Acceptée", color: "bg-indigo-500" },
    en_cours: { label: "En cours", color: "bg-blue-500" },
    terminee: { label: "Terminée", color: "bg-green-500" },
    annulee: { label: "Annulée", color: "bg-red-500" },
    refusee: { label: "Refusée", color: "bg-gray-500" },
  };

  const executionStateConfig = {
    non_commencee: { label: "En attente", color: "bg-yellow-500" },
    en_cours: { label: "En cours", color: "bg-blue-500" },
    terminee: { label: "Terminée", color: "bg-green-500" },
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmMessages = {
      refusee: "Voulez-vous rejeter cette demande ?",
      annulee: "Voulez-vous annuler cette demande ?",
      terminee: "Voulez-vous marquer cette demande comme terminée ?",
    };
    
    if (!window.confirm(confirmMessages[newStatus] || "Confirmez-vous cette action ?")) return;
    
    try {
      await axios.put(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
        { statut: newStatus },
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      toast.success(`Demande ${statusConfig[newStatus].label.toLowerCase()} avec succès`);
      onUpdate?.();
      navigate("/admin/demandes");
    } catch (err) {
      toast.error(err.response?.data?.message || `Erreur lors de la modification du statut`);
    }
  };

  const handleAssignSuccess = () => {
    setShowAssignModal(false);
    onUpdate?.();
  };

  const currentStatus = statusConfig[demande.statut] || statusConfig.refusee;
  const currentExecutionState = executionStateConfig[demande.etatExecution] || {
    label: "Inconnu",
    color: "bg-gray-500",
  };

  return (
    <div className="border border-orange-300 rounded-lg shadow-md bg-orange-50 overflow-hidden flex flex-col">
      {/* En-tête de la carte */}
      <div className="bg-orange-500 p-2">
        <h2 className="text-white font-bold text-lg uppercase text-center">
          Demande #{demande.numeroDemande}
        </h2>
      </div>

      {/* Corps de la carte */}
      <div className="p-3 flex-grow">
        {/* Section Client et Service */}
        <div className="grid grid-cols-2 gap-4 mb-2">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-semibold text-orange-600 capitalize line-clamp-1">
                {demande.clientPrenom} {demande.clientNom}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-semibold text-orange-600">{demande.service}</p>
            </div>
        </div>

        {/* Section Dates */}
        <div className="grid grid-cols-2 gap-4 mb-2">
          <div>
            <p className="text-sm text-gray-600">Réservation</p>
            <p className="font-medium">{formatDate(demande.date)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Intervention</p>
            <p className="font-medium">{formatDate(demande.dateIntervention)}</p>
          </div>
        </div>

        {/* Section Technicien */}
        <div className="mb-2">
          <p className="text-sm text-gray-600">Technicien</p>
          <p className="font-medium capitalize">
            {demande.technicienPrenom} {demande.technicienNom || "Non assigné"}
          </p>
        </div>

        {/* Section Statuts */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Statut</p>
            <span
              className={`${currentStatus.color} text-white px-3 py-1 rounded-full text-xs font-medium inline-block mt-1`}
            >
              {currentStatus.label}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-600">Exécution</p>
            <span
              className={`${currentExecutionState.color} text-white px-3 py-1 rounded-full text-xs font-medium inline-block mt-1`}
            >
              {currentExecutionState.label}
            </span>
          </div>
        </div>
      </div>

      {/* Pied de carte - Actions */}
      <div className="p-3 bg-orange-100 border-t border-orange-200">
        {demande.statut === "en_attente" && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-medium"
                onClick={() => handleStatusChange(demande._id, "refusee")}
              >
                Refuser
              </button>
              <button
                className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm font-medium"
                onClick={() => setShowAssignModal(true)}
              >
                Accepter
              </button>
            </div>
            <Link
              to={`/admin/demandes/${demande._id}`}
              className="text-center text-blue-600 hover:text-blue-800 text-sm"
            >
              Plus de détails
            </Link>
          </div>
        )}

        {["acceptee", "en_cours"].includes(demande.statut) && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 text-sm font-medium"
                onClick={() => handleStatusChange(demande._id, "annulee")}
              >
                Annuler
              </button>
              <Link
                to={`/admin/demandes/${demande._id}`}
                className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 text-sm font-medium text-center"
              >
                Détails
              </Link>
            </div>
          </div>
        )}

        {["annulee", "refusee", "terminee"].includes(demande.statut) && (
          <Link
            to={`/admin/demandes/${demande._id}`}
            className="block text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Plus de détails
          </Link>
        )}
      </div>

      {/* Modal d'assignation */}
      {showAssignModal && (
        <AssignTechnicienModal
          setShowModal={setShowAssignModal}
          demande={demande}
          onAssignSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
});

export default DemandesCard;