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
      return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
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
    non_commencee: { label: "Non commencée", color: "bg-yellow-500" },
    en_cours: { label: "En cours", color: "bg-blue-500" },
    terminee: { label: "Terminée", color: "bg-green-500" },
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmMessages = {
      refusee: "Voulez-vous rejeter cette demande ?",
      annulee: "Voulez-vous annuler cette demande ?",
      terminee: "Voulez-vous marquer cette demande comme terminée ?",
    };

    if (
      !window.confirm(
        confirmMessages[newStatus] || "Confirmez-vous cette action ?"
      )
    )
      return;

    try {
      await axios.put(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
        { statut: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success(
        `Demande ${statusConfig[newStatus].label.toLowerCase()} avec succès`
      );
      onUpdate?.(); // Rafraîchir la liste si une callback est fournie
      navigate("/admin/demandes");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          `Erreur lors de la modification du statut`
      );
    }
  };

  const handleAssignSuccess = () => {
    setShowAssignModal(false);
    onUpdate?.(); // Rafraîchir la liste des demandes
  };

  const currentStatus = statusConfig[demande.statut] || statusConfig.refusee;
  const currentExecutionState = executionStateConfig[demande.etatExecution] || {
    label: "Inconnu",
    color: "bg-gray-500",
  };

  return (
    <div className="border border-orange-300 p-4 rounded-lg shadow-md w-full bg-orange-50 flex flex-col">
      <h2 className="text-orange-500 font-bold text-lg mb-2 uppercase text-center">
        Informations demande
      </h2>

      <div className="space-y-2 mb-4">
        <p>
          <strong className="font-bold pe-2">N° DEMANDE :</strong>
          {demande.numeroDemande}
        </p>
        <p>
          <strong className="font-bold pe-2">SERVICE :</strong>
          <span className="text-orange-600">{demande.service}</span>
        </p>
        <p>
          <strong className="font-bold pe-2">DATE :</strong>
          {formatDate(demande.date)}
        </p>
        <p>
          <strong className="font-bold pe-2">CLIENT :</strong>
          <span className="text-orange-600">
            {demande.clientPrenom} {demande.clientNom}
          </span>
        </p>
        <p>
          <strong className="font-bold pe-2">TECHNICIEN :</strong>
          {demande.technicienPrenom} {demande.technicienNom || "Non assigné"}
        </p>
        <p>
          <strong className="font-bold pe-2">INTERVENTION :</strong>
          {formatDate(demande.dateIntervention)}
        </p>
        <p className="flex items-center">
          <strong className="font-bold pe-2">STATUT :</strong>
          <span
            className={`${currentStatus.color} text-white px-2 py-1 rounded-full text-sm`}
          >
            {currentStatus.label}
          </span>
        </p>
        <p className="flex items-center">
          <strong className="font-bold pe-2">EXÉCUTION :</strong>
          <span
            className={`${currentExecutionState.color} text-white px-2 py-1 rounded-full text-sm`}
          >
            {currentExecutionState.label}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="mt-auto">
        {demande.statut === "en_attente" && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <button
                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 flex-1"
                onClick={() => handleStatusChange(demande._id, "refusee")}
              >
                Refuser
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-1.5 rounded hover:bg-orange-600 flex-1"
                onClick={() => setShowAssignModal(true)}
              >
                Accepter
              </button>
            </div>
            <Link
              to={`/admin/demandes/${demande._id}`}
              className="text-center text-blue-500 hover:underline"
            >
              Plus de détails
            </Link>
          </div>
        )}

        {["acceptee", "en_cours"].includes(demande.statut) && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <button
                className="bg-red-500 text-white px-4 py-1.5 rounded hover:bg-red-600 flex-1"
                onClick={() => handleStatusChange(demande._id, "annulee")}
              >
                Annuler
              </button>
              <Link
                to={`/admin/demandes/${demande._id}`}
                className="bg-orange-500 text-white px-4 py-1.5 rounded hover:bg-orange-600 flex-1 text-center"
              >
                Détails
              </Link>
            </div>
          </div>
        )}

        {["annulee", "refusee", "terminee"].includes(demande.statut) && (
          <Link
            to={`/admin/demandes/${demande._id}`}
            className="block text-center text-blue-500 hover:underline"
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
