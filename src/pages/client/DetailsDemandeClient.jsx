import { useParams, Link, Links } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { parseISO } from "date-fns";
import toast from "react-hot-toast";
import { useDeleteDemandeMutation, useGetDemandeByIdQuery, useGetFacturesQuery, useUpdateDemandeMutation } from "../../API/demandesApi";
import { useGetCategorieByIdQuery } from "../../API/servicesApi";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserByIdQuery } from "../../API/authApi";
import { useState } from "react";
import { useCreateAvisMutation } from "../../API/servicesApi";

export default function DetailsDemandeClient() {
  const { id } = useParams();
  const { data: demande, isLoading, error } = useGetDemandeByIdQuery(id, { skip: !id });
  const idCategorie = demande?.categorieService;
  const { data: categorie } = useGetCategorieByIdQuery(idCategorie, { skip: !idCategorie });
  const idUser = demande?.admin;
  const { data: admin } = useGetUserByIdQuery(idUser, { skip: !idUser });
  // console.log(demande);
  const [updateDemande] = useUpdateDemandeMutation();
  const [deleteDemande] = useDeleteDemandeMutation();
  const [createAvis] = useCreateAvisMutation();
  const { data: factures = [] } = useGetFacturesQuery();
  const navigate = useNavigate();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    note: demande?.note || "",
    commentaire: demande?.commentaire || "",
  });

  const statusConfig = {
    en_attente: { label: "En attente", color: "bg-yellow-500" },
    acceptee: { label: "Acceptée", color: "bg-indigo-500" },
    en_cours: { label: "En cours", color: "bg-blue-500" },
    terminee: { label: "Terminée", color: "bg-green-500" },
    annulee: { label: "Annulée", color: "bg-red-500" },
    refusee: { label: "Refusée", color: "bg-gray-500" },
  };

  const handleStatusChange = async (id, newStatus) => {
    const confirmMessages = {
      annulee: "Voulez-vous annuler cette demande ?",
    };
    
    if (!window.confirm(confirmMessages[newStatus] || "Confirmez-vous cette action ?")) return;
    
    try {
      await updateDemande({ 
        id, 
        body: { 
          statut: newStatus, 
          etatExecution: 
          newStatus === "refusee" ? "annulee" : demande.etatExecution
         } 
      }).unwrap();
      
      toast.success(`Demande ${statusConfig[newStatus].label.toLowerCase()} avec succès`);
      navigate("/client/demandes");
    } catch (err) {
      toast.error(err.data?.message || `Erreur lors de la modification du statut`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous supprimer cette demande ?")) return;

    try {
      await deleteDemande(id).unwrap();
      toast.success("Demande supprimée avec succès");
      navigate("/client/demandes");
    } catch (err) {
      toast.error(err.data?.message || "Erreur lors de la suppression de la demande");
    }
  };

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    try {
      await createAvis({
        ...feedback,
        client: demande?.clientId,
        technicien: demande?.technicienId,
        service: demande?.serviceId,
        demande: demande?._id
      }).unwrap();

      toast.success("Évaluation soumise avec succès");
      setFeedback({ note: "", commentaire: "" });
      setShowFeedbackForm(false);
    } catch (err) {
      toast.error(err.data?.message || "Erreur lors de la soumission de l'évaluation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateFacture = async (id) => {
    try {
      const facture = factures.find(f => f.refDemande === id);
      if (!facture) {
        toast.error("Aucune facture trouvée pour cette demande");
        return;
      }
  
      // Appel API direct sans passer par Redux
      const response = await fetch(`https://easyservice-backend-iv29.onrender.com/api/factures/${facture.odooInvoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
  
      if (!response.ok) throw new Error("Erreur de téléchargement");
  
      const blob = await response.blob();
      const contentDisposition = response.headers.get('content-disposition');
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      let filename = 'facture.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch?.[1]) filename = filenameMatch[1];
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(link);
      }, 100);
      
      toast.success("Facture téléchargée avec succès");
    } catch (err) {
      console.error("Erreur de téléchargement:", err);
      toast.error(err.message || "Erreur lors du téléchargement");
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
          <Link to="/client/demandes" className="text-orange-500 hover:underline">
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
          <Link to="/client/demandes" className="text-orange-500 hover:underline">
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
      <Link to="/client/demandes" className="inline-block mb-4 text-orange-500 hover:underline">
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
                <span onClick={() => navigate(`/client/services/${demande.service._id}`)} className="underline cursor-pointer hover:text-orange-500">{demande.service?.nom || "Non spécifié"}</span>
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
                <span className="font-semibold">Date de demande :</span>{" "}
                {formatDate(demande.dateDemande)}
              </p>
              {!(demande.statut === "terminee") && (
              <p>
                <span className="font-semibold">Date d'intervention :</span>{" "}
                {formatDate(demande.dateIntervention)}
              </p>
              )}
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

          <div className="flex flex-col flex-wrap h-fit">
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

            {demande.statut === "terminee" && (
              <div className="mt-4">
                <h2 className="text-xl font-semibold mb-4 text-orange-500">
                  Informations sur l'intervention
                </h2>
                <div className="space-y-3">
                  <p>
                    <span className="font-semibold">Date d'intervention :</span>{" "}
                    {formatDate(demande.dateIntervention)}
                  </p>
                  <p>
                    <span className="font-semibold">Début intervention :</span>{" "}
                    {formatDate(demande.dates.debutIntervention)}
                  </p>
                  <p>
                    <span className="font-semibold">Fin intervention :</span>{" "}
                    {formatDate(demande.dates.finIntervention)}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-orange-500">
            Description
          </h2>
          <p className="bg-gray-100 p-4 rounded">
            {demande.description || "Aucune description fournie"}
          </p>
        </div>
      </div>

      <div className="p-3 border-t border-orange-200">
        {demande.statut === "en_attente" || demande.statut === "acceptee" || demande.statut === "en_cours" && (
          <div className="flex justify-end">
            <div className="w-full">
              <button
                className="fixed bottom-5 right-5 bg-red-500 text-white px-16 py-2 rounded hover:bg-red-600 text-sm font-medium w-fit"
                onClick={() => handleStatusChange(demande._id, "annulee")}
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {["refusee", "annulee"].includes(demande.statut) && (
          <div className="flex justify-end">
            <div className="w-full">
              <button
                className="fixed bottom-5 right-5 bg-red-500 text-white px-16 py-2 rounded hover:bg-red-600 text-sm font-medium w-fit"
                onClick={() => handleDelete(demande._id)}
              >
                Supprimer
              </button>
            </div>
          </div>
        )}

        {demande.statut === "terminee" && (
          <div className="">
            <div className="flex flex-col-reverse justify-end items-end sm:flex-row gap-2 fixed bottom-5 sm:right-8 right-5">
            <button
                className="bg-gray-500 text-white px-4 py-1.5 rounded hover:bg-gray-600 flex-1"
                onClick={() => generateFacture(demande?._id)}
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
          </div>
        )}

{showFeedbackForm && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Donnez votre avis</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (entre 1 et 5)
              </label>
              <div className="flex items-center gap-2 w-full">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, note: star }))}
                    className={`text-3xl ${feedback.note >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
                <input
                  type="number"
                  name="note"
                  min="1"
                  max="5"
                  value={feedback.note}
                  onChange={handleFeedbackChange}
                  className="w-12 p-2 border rounded text-center"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire
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
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isSubmitting ? 'En cours...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      )}
      </div>
    </div>  
  );
}