import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseISO } from "date-fns";
import toast from "react-hot-toast";
import { useAssignerDemandeMutation, useGetDemandeByIdQuery } from "../../API/demandesApi";
import { useGetCategorieByIdQuery } from "../../API/servicesApi";
import { useNavigate } from "react-router-dom";
import AssignTechnicienModal from "../../components/Modals/AssignerTechnicienModal";
import { useGetUserByIdQuery } from "../../API/authApi";
import {
  FiX, 
  FiCheck
} from "react-icons/fi";
import ConfirmationModal from "../../components/Modals/ConfirmationModal";

export default function DemandeDetails() {
  const { id } = useParams();
  const { data: demande, isLoading, error } = useGetDemandeByIdQuery(id, { skip: !id });
  const idCategorie = demande?.categorieService;
  const { data: categorie } = useGetCategorieByIdQuery(idCategorie, { skip: !idCategorie });
  const idUser = demande?.admin;
  const { data: admin } = useGetUserByIdQuery(idUser, { skip: !idUser });
  // console.log(demande);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignerDemande] = useAssignerDemandeMutation();
  const [updateDemande] = useAssignerDemandeMutation();
  const navigate = useNavigate();
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    action: null,
    id: null
  });

  const statusConfig = {
    en_attente: { label: "En attente", color: "bg-yellow-500" },
    acceptee: { label: "Acceptée", color: "bg-indigo-500" },
    en_cours: { label: "En cours", color: "bg-blue-500" },
    terminee: { label: "Terminée", color: "bg-green-500" },
    annulee: { label: "Annulée", color: "bg-red-500" },
    refusee: { label: "Refusée", color: "bg-gray-500" },
  };

    // const handleStatusChange = async (id, newStatus) => {
    //   const confirmMessages = {
    //     refusee: "Voulez-vous rejeter cette demande ?",
    //     annulee: "Voulez-vous annuler cette demande ?",
    //   };
      
    //   if (!window.confirm(confirmMessages[newStatus] || "Confirmez-vous cette action ?")) return;
      
    //   try {
    //     await updateDemande({ 
    //       id, 
    //       body: { 
    //         statut: newStatus, 
    //         etatExecution: 
    //         newStatus === "refusee" ? "annulee" : demande.etatExecution
    //        } 
    //     }).unwrap();
        
    //     toast.success(`Demande ${statusConfig[newStatus].label.toLowerCase()} avec succès`);
    //     navigate("/admin/demandes");
    //   } catch (err) {
    //     toast.error(err.data?.message || `Erreur lors de la modification du statut`);
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
      // onRefresh?.();
    } catch (err) {
      toast.error(err.data?.message || `Erreur lors de la modification du statut`);
    
    } finally {
      setConfirmationState({ isOpen: false, action: null, id: null });
    }
  };
    

  const handleAssignSuccess = async (technicienId) => {
      try {
        await assignerDemande({
          demandeId: demande._id,
          technicienId
        }).unwrap();
        
        toast.success("Technicien assigné avec succès");
        setShowAssignModal(false);
      } catch (err) {
        toast.error(err.data?.message || "Erreur lors de l'assignation");
      }
    };

  const formatDate = (dateString) => {
      if (!dateString) return "Non définie";
      try {
        return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
      } catch {
        return dateString;
      }
    };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">Chargement des détails de la demande...</p>
        </div>
      </div>
    );
  }

  if (error) {
    toast.error("Erreur lors du chargement de la demande");
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold mb-4">Erreur</h2>
          <p className="mb-4">{error?.data?.message || "Erreur lors du chargement"}</p>
          <Link to="/admin/demandes" className="text-orange-500 hover:underline">
            Retour à la liste des demandes
          </Link>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Demande non trouvée</h2>
          <Link to="/admin/demandes" className="text-orange-500 hover:underline">
            Retour à la liste des demandes
          </Link>
        </div>
      </div>
    );
  };

  const formattedDemande = {
    ...demande,
    service: typeof demande.service === "object" ? demande.service : { _id: demande.service, nom: "Service inconnu" },
    categorie: categorie?.nom || "Catégorie inconnue",
    client: typeof demande.client === "object" ? demande.client : { _id: demande.client, prenom: "Client", nom: "inconnu" },
    technicien: typeof demande.technicien === "object" ? demande.technicien : { _id: demande.technicien, prenom: "Technicien", nom: "inconnu" },
    dateDemande: format(new Date(demande.dateDemande), "PPPP", { locale: fr }),
    dateIntervention: demande.dateIntervention
      ? format(new Date(demande.dateIntervention), "PPPP", { locale: fr })
      : "Non définie",
  };

  return (
    <div className="container mx-auto sm:px-4 sm:py-8">
      <Link to="/admin/demandes" className="inline-block mb-4 text-orange-500 hover:underline">
        &larr; Retour aux demandes
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center uppercase">
        Détails de la demande #{formattedDemande.numeroDemande}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-2 sm:p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex flex-col flex-wrap">
            <h2 className="text-xl font-semibold mb-4 text-orange-500">
              Informations générales
            </h2>

            <div className="space-y-3">
              <p>
                <span className="font-semibold">Service :</span>{" "}
                <span onClick={() => navigate(`/admin/services/${demande.service._id}`)} className="underline cursor-pointer hover:text-orange-500">{demande.service?.nom || "Non spécifié"}</span>
              </p>
              <p>
                <span className="font-semibold">Catégorie :</span>{" "}
                {categorie?.nom || "Non spécifiée"}
              </p>
              <p>
                <span className="font-semibold">Statut :</span>{" "}
                <span
                  className={`px-2 py-1 rounded font-medium inline-block ${
                    demande.statut === "en_attente"
                      ? "bg-yellow-100 text-yellow-800"
                      : demande.statut === "acceptee"
                      ? "bg-indigo-100 text-indigo-800"
                      : demande.statut === "en_cours"
                      ? "bg-blue-100 text-blue-800"
                      : demande.statut === "terminee"
                      ? "bg-green-100 text-green-800"
                      : demande.statut === "annulee"
                      ? "bg-red-100 text-red-800"
                      : demande.statut === "refusee"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {demande.statut === "en_attente" ? "En attente" : "" }
                  { demande.statut === "acceptee" ? "Acceptée" : ""}
                  {demande.statut === "en_cours" ? "En cours" : ""}
                  {demande.statut === "terminee" ? "Terminée" : ""}
                  {demande.statut === "annulee" ? "Annulee" : ""}
                  {demande.statut === "refusee" ? "Refusée" : ""}
                  
                </span>
              </p>
              <p>
                <span className="font-semibold">État d'exécution :</span>{" "}
                <span
                  className={`px-2 py-1 rounded font-medium inline-block ${
                    demande.etatExecution === "non_commencee"
                      ? "bg-yellow-100 text-yellow-800"
                      : demande.etatExecution === "en_cours"
                      ? "bg-blue-100 text-blue-800"
                      : demande.etatExecution === "terminee"
                      ? "bg-green-100 text-green-800"
                      : demande.etatExecution === "annulee"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {demande.etatExecution === "non_commencee" ? "En attente" : "" }
                  {demande.etatExecution === "en_cours" ? "En cours" : ""}
                  {demande.etatExecution === "terminee" ? "Terminée" : ""}
                  {demande.etatExecution === "annulee" ? "Annulee" : ""}
                  
                </span>
              </p>
              <p>
                <span className="font-semibold">Date de demande :</span>{" "}
                {formatDate(demande.dateDemande)}
              </p>
              <p>
                <span className="font-semibold">Date d'intervention :</span>{" "}
                {formatDate(demande.dateIntervention)}
              </p>
              <p>
                <span className="font-semibold">Durée :</span>{" "}
                {demande.duree} {" "} {demande.uniteDuree}
              </p>
              <p>
                <span className="font-semibold">Tarif :</span>{" "}
                {formatDate(demande.tarif)} {" FCFA"}
              </p>
            </div>
          </div>

          <div className="flex flex-col flex-wrap">
            <h2 className="text-xl font-semibold mb-4 text-orange-500">
              Personnes concernées
            </h2>

            <div className="space-y-3">
              <p>
                <span className="font-semibold">Admin :</span>{" "}
                <span className="capitalize">{admin?.prenom ? admin.prenom : "Non assigné"} {admin?.nom}</span>
              </p>
              <p>
                <span className="font-semibold">Client :</span>{" "}
                {demande.client?.prenom} {demande.client?.nom}
              </p>
              <p>
                <span className="font-semibold">Technicien :</span>{" "}
                {demande.technicien?.prenom || "Non"}{" "}
                {demande.technicien?.nom || "assigné"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-orange-500">
            Description
          </h2>
          <p className="bg-gray-50 p-4 rounded">
            {demande.description || "Aucune description fournie"}
          </p>
        </div>
      </div>

      <div className="p-3 border-t border-orange-200">
        {demande.statut === "en_attente" && (
          <div className="">
            <div className="fixed bottom-6 right-6 flex gap-3 bg-white p-3 rounded-full shadow-lg">
              <button
                className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 text-sm font-medium w-fit flex items-center"
                onClick={() => handleStatusChange(demande._id, "refusee")}
                title="Refuser"
              >
                <FiX className="text-xl" />
              </button>
              <button
                className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700 text-sm font-medium w-fit flex items-center"
                onClick={() => setShowAssignModal(true)}
                title="Accepter"
              >
                <FiCheck className="text-xl" />
              </button>
            </div>
          </div>
        )}

        {["acceptee", "en_cours"].includes(demande.statut) && (
          <div className="flex justify-end">
            <div className="w-full">
              <button
                className="fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm font-medium w-fit flex items-center"
                onClick={() => handleStatusChange(demande._id, "annulee")}
                title="Annuler"
              >
                <FiX className={`mr-2`} /> Annuler
              </button>
            </div>
          </div>
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
      <ConfirmationModal
        isOpen={confirmationState.isOpen}
        onClose={() => setConfirmationState({ ...confirmationState, isOpen: false })}
        onConfirm={handleConfirmAction}
        title={`Confirmer l'action`}
        message={`Voulez-vous vraiment ${confirmationState.action === 'refusee' ? 'refuser' : 'annuler'} cette demande ?`}
        confirmText={confirmationState.action === 'refusee' ? 'Refuser' : 'Annuler'}
        cancelText="Retour"
        type={confirmationState.action === 'refusee' ? 'danger' : 'danger'}
      />
    </div>  
  );
}
