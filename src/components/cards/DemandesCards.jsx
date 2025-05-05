import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AssignTechnicienModal from "../Modals/AssignerTechnicienModal";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { memo } from "react";
import { 
  useUpdateDemandeMutation,
  useDeleteDemandeMutation
} from "../../API/demandesApi";
import { 
  FiUser, FiCalendar, FiTool, FiClock, FiCheckCircle, 
  FiXCircle, FiAlertCircle, FiInfo, FiEdit, FiTrash2
} from "react-icons/fi";

const DemandesCard = memo(({ demande, onRefresh }) => {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();
  const [updateDemande] = useUpdateDemandeMutation();
  const [supprimerDemande] = useDeleteDemandeMutation();

  useEffect(() => {
    const deleteIfNoClient = async () => {
      if (demande?.client === null) {
        try {
          await supprimerDemande(demande._id);
          toast.success(`Demande ${demande.numeroDemande} supprimée car le client est manquant.`);
          onRefresh?.();
        } catch (error) {
          console.error("Erreur lors de la suppression :", error);
        toast.error("Erreur lors de la suppression de la demande");
        }
      }
    };

    deleteIfNoClient();
  }, [demande, supprimerDemande, onRefresh]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const statusConfig = {
    en_attente: { label: "En attente", color: "bg-yellow-100 text-yellow-800", icon: <FiClock className="mr-1" /> },
    acceptee: { label: "Acceptée", color: "bg-blue-100 text-blue-800", icon: <FiCheckCircle className="mr-1" /> },
    en_cours: { label: "En cours", color: "bg-indigo-100 text-indigo-800", icon: <FiTool className="mr-1" /> },
    terminee: { label: "Terminée", color: "bg-green-100 text-green-800", icon: <FiCheckCircle className="mr-1" /> },
    annulee: { label: "Annulée", color: "bg-red-100 text-red-800", icon: <FiXCircle className="mr-1" /> },
    refusee: { label: "Refusée", color: "bg-gray-100 text-gray-800", icon: <FiXCircle className="mr-1" /> },
  };

  const executionStateConfig = {
    non_commencee: { label: "Non commencée", color: "bg-yellow-100 text-yellow-800", icon: <FiClock className="mr-1" /> },
    en_cours: { label: "En cours", color: "bg-blue-100 text-blue-800", icon: <FiTool className="mr-1" /> },
    terminee: { label: "Terminée", color: "bg-green-100 text-green-800", icon: <FiCheckCircle className="mr-1" /> },
    annulee: { label: "Annulée", color: "bg-gray-100 text-gray-800", icon: <FiXCircle className="mr-1" /> },
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmMessages = {
      refusee: "Voulez-vous rejeter cette demande ?",
      annulee: "Voulez-vous annuler cette demande ?",
      terminee: "Voulez-vous marquer cette demande comme terminée ?",
    };
    
    if (!window.confirm(confirmMessages[newStatus] || "Confirmez-vous cette action ?")) return;
    
    try {
      await updateDemande({ 
        id, 
        body: { 
          statut: newStatus, 
          etatExecution: 
          newStatus === "refusee" ? "annulee" : demande.etatExecution ||
          newStatus === "annulee" ? "annulee" : demande.etatExecution
         } 
      }).unwrap();
      
      toast.success(`Demande ${statusConfig[newStatus].label.toLowerCase()} avec succès`);
      onRefresh?.();
    } catch (err) {
      toast.error(err.data?.message || `Erreur lors de la modification du statut`);
    }
  };

  const currentStatus = statusConfig[demande.statut] || statusConfig.refusee;
  const currentExecutionState = executionStateConfig[demande.etatExecution] || executionStateConfig.annulee;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* En-tête de la carte */}
      <div className="px-4 pt-4 border-b border-gray-100">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-gray-800 font-bold text-lg flex items-center">
            {/* <FiInfo className="mr-2 text-gray-500" /> */}
          {demande.numeroDemande}
          </h2>
          <div className="flex space-x-2">
            <span className={`${currentStatus.color} px-3 py-1 rounded-full text-xs font-medium flex items-center`}>
              {currentStatus.icon}
              {currentStatus.label}
            </span>
          </div>
        </div>
      </div>

      {/* Corps de la carte */}
      <div className="p-4 flex-grow space-y-4">
        {/* Section Client et Service */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <FiUser className="mt-1 mr-2 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Client</p>
              <p className="font-medium text-gray-800 capitalize line-clamp-1">
                {demande?.client?.prenom} {demande?.client?.nom || "Non spécifié"}
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <FiTool className="mt-1 mr-2 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Service</p>
              <p className="font-medium text-gray-800 line-clamp-1">{demande.service.nom}</p>
            </div>
          </div>
        </div>

        {/* Section Dates */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start">
            <FiCalendar className="mt-1 mr-2 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Réservation</p>
              <p className="font-medium text-gray-800">{formatDate(demande.dateDemande)}</p>
            </div>
          </div>
          <div className="flex items-start">
            <FiCalendar className="mt-1 mr-2 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">Intervention</p>
              <p className="font-medium text-gray-800">{formatDate(demande.dateIntervention)}</p>
            </div>
          </div>
        </div>

        {/* Section Technicien */}
        <div className="flex items-start">
          <FiUser className="mt-1 mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Technicien</p>
            <p className="font-medium text-gray-800 capitalize">
              {demande.technicien?.prenom} {demande.technicien?.nom || "Non assigné"}
            </p>
          </div>
        </div>

        {/* Section État d'exécution */}
        <div className="flex items-center">
          <FiAlertCircle className="mr-2 text-gray-400" />
          <div>
            <p className="text-xs text-gray-500">Exécution</p>
            <span className={`${currentExecutionState.color} px-3 py-1 rounded-full text-xs font-medium flex items-center mt-1`}>
              {currentExecutionState.icon}
              {currentExecutionState.label}
            </span>
          </div>
        </div>
      </div>

      {/* Pied de carte - Actions */}
      <div className="p-3 bg-gray-50 border-t border-gray-200">
        {demande.statut === "en_attente" && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="flex items-center justify-center bg-white text-red-600 border border-red-200 px-3 py-2 rounded hover:bg-red-100 text-sm font-medium"
                onClick={() => handleStatusChange(demande._id, "refusee")}
              >
                <FiXCircle className="mr-2" />
                Refuser
              </button>
              <button
                className="flex items-center justify-center bg-white text-green-600 border border-green-200 px-3 py-2 rounded hover:bg-green-100 text-sm font-medium"
                onClick={() => setShowAssignModal(true)}
              >
                <FiCheckCircle className="mr-2" />
                Accepter
              </button>
            </div>
            <Link
              to={`/admin/demandes/${demande._id}`}
              className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm hover:underline"
            >
              <FiEdit className="mr-2" />
              Plus de détails
            </Link>
          </div>
        )}

        {["acceptee", "en_cours"].includes(demande.statut) && (
          <div className="flex flex-col gap-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                className="flex items-center justify-center bg-white text-red-600 border border-red-200 px-3 py-2 rounded hover:bg-red-100 text-sm font-medium"
                onClick={() => handleStatusChange(demande._id, "annulee")}
              >
                <FiXCircle className="mr-2" />
                Annuler
              </button>
              <Link
                to={`/admin/demandes/${demande._id}`}
                className="flex items-center justify-center bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium"
              >
                <FiEdit className="mr-2" />
                Détails
              </Link>
            </div>
          </div>
        )}

        {["annulee", "refusee", "terminee"].includes(demande.statut) && (
          <Link
            to={`/admin/demandes/${demande._id}`}
            className="flex items-center justify-center text-gray-600 hover:text-gray-800 text-sm hover:underline text-sm font-medium"
          >
            <FiEdit className="mr-2" />
            Plus de détails
          </Link>
        )}
      </div>

      {/* Modal d'assignation */}
      {showAssignModal && (
        <AssignTechnicienModal
          setShowModal={setShowAssignModal}
          demande={demande}
        />
      )}
    </div>
  );
});

export default DemandesCard;