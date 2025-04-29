import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function InterventionCard({ intervention }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = useCallback((dateString) => {
    try {
      return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
    } catch {
      return "Date non définie";
    }
  }, []);

  // console.log(intervention)

  const generateFacture = async (id) => {
    // if (!window.confirm("Voulez-vous générer la facture ?")) return;

    try {

      // const formData = new FormData();
      // formData.append("montant", demande.tarif);
      // formData.append("service", demande?.service?._id);
      // formData.append("technicien", demande?.technicien?._id);
      // formData.append("client", demande?.clientId);
      // formData.append("admin", "67da88347e9d8aefcaa19120");
      // formData.append("refDemande", id);

      // console.log(intervention)

      
      
      // console.log(intervention.tarif, intervention.serviceId, intervention.technicienId, intervention.clientId, "67da88347e9d8aefcaa19120", id);

      const { data } = await axios.post(
        `https://easyservice-backend-iv29.onrender.com/api/factures/creer/facture`,
        {
          montant: intervention.tarif,
            service: intervention?.serviceId,
            technicien: intervention?.technicienId,
            client: intervention?.clientId,
            admin: intervention?.adminId,
            refDemande: id
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      console.log(data);

      toast.success("Facture générée avec succès");
      // navigate("/demandes");
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de la génération de la facture"
      );
    }
  };

  const handleStatusChange = useCallback(async (action, id) => {
    if (!window.confirm(`Voulez-vous ${action} cette intervention ?`)) return;

    setIsProcessing(true);
    try {
      const endpoint =
        action === "commencer" ? `commencer/${id}` : `terminer/${id}`;

      // Ajout des données nécessaires pour le serveur
      const requestData =
        action === "commencer"
          ? { dateDebut: new Date().toISOString() }
          : { dateFin: new Date().toISOString() };

      await axios.put(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/${endpoint}`,
        requestData, // Envoi des données nécessaires
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        `Intervention ${
          action === "commencer" ? "démarrée" : "terminée"
        } avec succès`
      );
    } catch (err) {
      console.error("Erreur détaillée:", err);
      toast.error(
        err.response?.data?.message ||
          `Échec de l'opération: ${err.message}` ||
          "Erreur inconnue, veuillez réessayer"
      );
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const getStatusBadge = (status) => {
    const statusMap = {
      non_commencee: {
        text: "Non commencée",
        class: "bg-gray-100 text-gray-800",
      },
      en_cours: { text: "En cours", class: "bg-yellow-100 text-yellow-800" },
      terminee: { text: "Terminée", class: "bg-green-100 text-green-800" },
      annulee: { text: "Annulée", class: "bg-red-100 text-red-800" },
    };

    const statusInfo = statusMap[status] || statusMap.non_commencee;
    return (
      <span
        className={`inline-block px-2 py-1 text-xs rounded ${statusInfo.class}`}
      >
        {statusInfo.text}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border border-orange-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      <h3 className="text-lg font-bold text-center mb-3 text-orange-600 truncate">
        {intervention.service || "Service non spécifié"}
      </h3>

      <div className="space-y-2">
        <p className="truncate">
          <span className="font-semibold">Client :</span>{" "}
          {intervention.client || "Non spécifié"}
        </p>
        <p>
          <span className="font-semibold">Date :</span>{" "}
          {formatDate(intervention.dateIntervention)}
        </p>
        <p>
          <span className="font-semibold">Heure :</span>
          {intervention.heureDebut || "Non définie"} -{" "}
          {intervention.heureFin || "Non définie"}
        </p>
        <p className="flex items-center">
          <span className="font-semibold mr-2">Statut :</span>
          {getStatusBadge(intervention.etatExecution)}
        </p>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 text-blue-500 text-sm hover:underline focus:outline-none"
        disabled={isProcessing}
      >
        {showDetails ? "Masquer les détails" : "Voir les détails"}
      </button>

      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-4 border-t"
        >
          <p className="mb-2 break-words">
            <span className="font-semibold">Adresse :</span>{" "}
            {intervention.adresse || "Non spécifiée"}
          </p>
          <p className="mb-3 break-words">
            <span className="font-semibold">Description :</span>{" "}
            {intervention.description || "Aucune description"}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {intervention.etatExecution === "non_commencee" && (
              <>
                <button
                  onClick={() =>
                    handleStatusChange("commencer", intervention._id)
                  }
                  disabled={isProcessing}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm disabled:opacity-50"
                >
                  {isProcessing ? "Traitement..." : "Commencer"}
                </button>
              </>
            )}

            {intervention.etatExecution === "en_cours" && (
              <>
                <button
                  onClick={() =>
                    handleStatusChange("terminer", intervention._id) && generateFacture(intervention._id)
                  }
                  disabled={isProcessing}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm disabled:opacity-50"
                >
                  {isProcessing ? "Traitement..." : "Terminer"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
