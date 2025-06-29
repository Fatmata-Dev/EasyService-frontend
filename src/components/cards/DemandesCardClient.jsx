import React, { useState, memo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { fr, te } from "date-fns/locale";
import {
  useUpdateDemandeMutation,
  useDeleteDemandeMutation,
  useGetFacturesQuery,
} from "../../API/demandesApi";
import { useCreateAvisMutation } from "../../API/servicesApi";
import { FiArrowRight, FiCalendar, FiChevronRight, FiClock, FiXCircle, FiEye, FiFileText, FiMessageSquare, FiStar, FiThumbsUp, FiTool, FiTrash2, FiUser, FiCheckCircle, FiPlay, FiX } from "react-icons/fi";
import ConfirmationModal from "../Modals/ConfirmationModal";

const DemandesCardClient = memo(({ demande, onRefresh }) => {
  const navigate = useNavigate();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    note: demande.note || "",
    commentaire: demande.commentaire || "",
  });
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    action: null, // 'commencer' ou 'terminer'
    id: null
  });

  const [updateDemande] = useUpdateDemandeMutation();
  const [deleteDemande] = useDeleteDemandeMutation();
  const [createAvis] = useCreateAvisMutation();
  const { data: factures = [] } = useGetFacturesQuery();

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const formatHeure = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  const statutConfig = {
    en_attente: { 
      label: "En attente", 
      icon: <FiClock className="w-4 h-4 mr-1 text-yellow-600" />,
      color: "bg-yellow-100 text-yellow-800"
    },
    acceptee: { 
      label: "Acceptée", 
      icon: <FiCheckCircle className="w-4 h-4 mr-1 text-blue-600" />,
      color: "bg-blue-100 text-blue-800"
    },
    en_cours: { 
      label: "En cours", 
      icon: <FiPlay className="w-4 h-4 mr-1 text-indigo-600" />,
      color: "bg-indigo-100 text-indigo-800"
    },
    terminee: { 
      label: "Terminée", 
      icon: <FiCheckCircle className="w-4 h-4 mr-1 text-green-600" />,
      color: "bg-green-100 text-green-800"
    },
    annulee: { 
      label: "Annulée", 
      icon: <FiXCircle className="w-4 h-4 mr-1 text-red-600" />,
      color: "bg-red-100 text-red-800"
    },
    refusee: { 
      label: "Refusée", 
      icon: <FiXCircle className="w-4 h-4 mr-1 text-gray-600" />,
      color: "bg-gray-100 text-gray-800"
    },
  };

  const generateFacture = async (id) => {
    try {
      const facture = factures.find((f) => f.refDemande === id);
      if (!facture) return toast.error("Aucune facture trouvée");
      const response = await fetch(
        `${import.meta.env.VITE_Backend_URL}/api/factures/${facture.odooInvoiceId}/download`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` } }
      );
      if (!response.ok) throw new Error("Erreur de téléchargement");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "facture.pdf";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      toast.success("Facture téléchargée");
    } catch (err) {
      toast.error(err.message || "Erreur lors du téléchargement");
    }
  };

  // const handleCancel = async (id) => {
  //   if (!window.confirm("Annuler cette demande ?")) return;
  //   try {
  //     await updateDemande({ id, body: { statut: "annulee", etatExecution: "annulee" } }).unwrap();
  //     toast.success("Demande annulée");
  //     navigate("/client/demandes");
  //     onRefresh?.();
  //   } catch (err) {
  //     toast.error(err.data?.message || "Erreur lors de l'annulation");
  //   }
  // };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Supprimer cette demande ?")) return;
  //   try {
  //     await deleteDemande(id).unwrap();
  //     toast.success("Demande supprimée");
  //     navigate("/client/demandes");
  //     onRefresh?.();
  //   } catch (err) {
  //     toast.error(err.data?.message || "Erreur lors de la suppression");
  //   }
  // };

  const handleStatusChange = (id, action) => {
    setConfirmationState({
      isOpen: true,
      action,
      id
    });
  };

  const handleConfirmAction = async () => {
    const { id, action:newStatus } = confirmationState;
    
    try {
      if(newStatus === "annulee"){
        await updateDemande({ 
          id, 
          body: { 
            statut: newStatus, 
            etatExecution: 
            newStatus === "annulee" ? "annulee" : demande.etatExecution
           } 
        }).unwrap();
      }

      if(newStatus === "delete") {
        await deleteDemande (id).unwrap();
      }
      
      navigate("/client/demandes");
      
      toast.success(`Demande ${newStatus.toLowerCase()} avec succès`);
      onRefresh?.();
    } catch (err) {
      toast.error(err.data?.message || `Erreur lors de la modification du statut`);
    
    } finally {
      setConfirmationState({ isOpen: false, action: null, id: null });
    }
  };

  // console.log(demande);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!feedback.note || feedback.note < 1 || feedback.note > 5) {
          toast.error("Veuillez donner une note valide entre 1 et 5");
          return;
        }
    
    setIsSubmitting(true);

    try {
      await createAvis({
        ...feedback,
        client: demande?.client?._id,
        technicien: demande?.technicien?._id,
        service: demande?.serviceId,
        demande: demande?._id,
      }).unwrap();
      toast.success("Évaluation envoyée");
      setFeedback({ note: "", commentaire: "" });
      setShowFeedbackForm(false);
      onRefresh?.();
      navigate('/client/avis', { replace: true });
    } catch (err) {
      toast.error(err.data?.message || "Erreur lors de l'envoi");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStatut = statutConfig[demande?.statut] || statutConfig.refusee;

  return (
    <div className="border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start flex-wrap mb-3">
          <h2 className="text-lg font-semibold text-gray-800">
            {demande?.numeroDemande}
          </h2>
          <span className={`${currentStatut.color} px-2 py-1 rounded-full text-xs font-medium flex items-center`}>
            {currentStatut.icon}
            {currentStatut.label}
          </span>
        </div>

        <div className="space-y-3 text-sm text-gray-600">

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FiTool className="w-4 h-4 text-gray-400" />
              </div>
              <div className="ml-2">
                  <p className="text-xs text-gray-500">Service</p>
                  <p className="font-medium capitalize line-clamp-1">{demande?.service?.nom || demande?.service}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FiUser className="w-4 h-4 text-gray-400" />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Technicien</p>
                <p className="font-medium capitalize line-clamp-1">
                  {demande?.technicienPrenom || demande?.technicien?.prenom} {demande?.technicienNom || demande?.technicien?.nom || "Non assigné"}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FiCalendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Date demande</p>
                <p className="font-medium">{formatDate(demande?.dateDemande)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FiClock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Heure demande</p>
                <p className="font-medium">{formatHeure(demande?.dateDemande)}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FiCalendar className="w-4 h-4 text-gray-400" />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Date intervention</p>
                <p className="font-medium">{formatDate(demande?.dateIntervention)}</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <FiClock className="w-4 h-4 text-gray-400" />
              </div>
              <div className="ml-2">
                <p className="text-xs text-gray-500">Heure intervention</p>
                <p className="font-medium">{formatHeure(demande?.dateIntervention)}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
        {["en_attente", "en_cours", "acceptee"].includes(demande?.statut) && (
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to={`/client/demandes/${demande?._id}`} 
              className="flex items-center justify-center bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium"
            >
              <FiEye className="w-4 h-4 mr-1.5" /> 
              Détails
              <FiChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
            <button
              onClick={() => handleStatusChange(demande._id, "annulee")}
              className="flex items-center justify-center bg-white text-red-600 border border-red-200 px-3 py-2 rounded hover:bg-red-100 text-sm font-medium"
            >
              <FiXCircle className="w-4 h-4 mr-1.5" />
              Annuler
            </button>
          </div>
        )}

        {["annulee", "refusee"].includes(demande?.statut) && (
          <div className="grid grid-cols-2 gap-2">
            <Link 
              to={`/client/demandes/${demande?._id}`} 
              className="flex items-center justify-center bg-white text-gray-600 border border-gray-200 px-3 py-2 rounded hover:bg-gray-100 text-sm font-medium"
            >
              <FiEye className="w-4 h-4 mr-1.5" /> 
              Détails
              <FiChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
            <button
              onClick={() => handleStatusChange(demande._id, "delete")}
              className="flex items-center justify-center bg-white text-red-600 border border-red-200 px-3 py-2 rounded hover:bg-red-100 text-sm font-medium"
            >
              <FiTrash2 className="w-4 h-4 mr-1.5" />
              Supprimer
            </button>
          </div>
        )}

        {demande?.statut === "terminee" && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <button
                onClick={() => generateFacture(demande?._id)}
                className="flex-1 flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 py-2 rounded text-sm font-medium"
              >
                <FiFileText className="w-4 h-4 mr-1.5" /> 
                Facture
              </button>
              <button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="flex-1 flex items-center justify-center bg-white border border-yellow-300 hover:bg-yellow-100 text-yellow-700 py-2 rounded text-sm font-medium"
              >
                <FiStar className="w-4 h-4 mr-1.5" />
                {showFeedbackForm ? "Masquer" : "Évaluer"}
              </button>
            </div>
            <div className="flex justify-center items-center">
              <Link
                to={`/client/demandes/${demande?._id}`}
                className="inline-flex items-center text-sm p-1 text-blue-600 hover:text-blue-800 hover:underline"
              >
                Voir les détails <FiArrowRight size={14} className="ml-1" />
              </Link>
            </div>

            {showFeedbackForm && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiMessageSquare size={18} className="mr-2 text-orange-500" />
              Donnez votre avis
            </h3>
            <button 
              onClick={() => setShowFeedbackForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={18} />
            </button>
          </div>
          
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre note
              </label>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, note: star }))}
                      className={`p-1 rounded-full ${
                        feedback.note >= star 
                          ? 'bg-yellow-100 text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <FiStar size={20} className={feedback.note >= star ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  name="note"
                  min="1"
                  max="5"
                  value={feedback.note}
                  onChange={handleFeedbackChange}
                  className="w-14 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre commentaire
              </label>
              <textarea
                name="commentaire"
                value={feedback.commentaire}
                onChange={handleFeedbackChange}
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                rows="3"
                placeholder="Décrivez votre expérience..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <FiX size={16} className="mr-1" />
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <FiClock size={16} className="mr-1 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <FiThumbsUp size={16} className="mr-1" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState({ ...confirmationState, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={`Confirmer l'action`}
        message={`Voulez-vous vraiment ${confirmationState.action === 'delete' ? 'supprimer' : 'annuler'} cette demande ?`}
        confirmText={confirmationState.action === 'delete' ? 'Supprimer' : 'Annuler'}
        cancelText="Retour"
        type={confirmationState.action === 'delete' ? 'danger' : 'danger'}
      />
    </div>
  );
});

export default DemandesCardClient;