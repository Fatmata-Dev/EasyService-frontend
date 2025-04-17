import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import InterventionCard from "../../components/cards/InterventionCard";
import { motion } from "framer-motion";

export default function Intervention() {
  const [user, setUser] = useState(null);
  const [allInterventions, setAllInterventions] = useState([]);
  const [displayedInterventions, setDisplayedInterventions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeTab, setActiveTab] = useState("en_cours");

  // Récupérer les infos du technicien connecté
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const fetchInterventions = useCallback(async () => {
    try {
      setLoading(true);

      if (!user || user.role !== "technicien") return;

      const response = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/technicien/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const interventionsAvecDetails = response.data.map((intervention) => {
        const demandeObj = intervention || {};
        const serviceObj = demandeObj.service || { nom: "Service inconnu" };
        const clientObj = demandeObj.client || {
          prenom: "Client",
          nom: "inconnu",
        };
        // console.log("Intervention:", intervention);
        // console.log("Demande:", demandeObj);

        return {
          _id: intervention._id,
          dateIntervention: intervention.dateIntervention || "Non définie",
          heureDebut: intervention.heureDebut || "À définir",
          heureFin: intervention.heureFin || "À définir",
          statut: intervention.statut || "en_attente",
          service: serviceObj.nom,
          client: `${clientObj.prenom} ${clientObj.nom}`,
          adresse: demandeObj.adresse || "Adresse non spécifiée",
          description: demandeObj.description || "Aucune description",
          note: intervention.note || null,
          commentaire: intervention.commentaire || "",
        };
      });

      setAllInterventions(interventionsAvecDetails);
    } catch (err) {
      //   console.error("Erreur:", err);
      toast.error(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchInterventions();
    }
  }, [fetchInterventions, user]);

  // Normalisation des statuts
  const normalizeStatut = (statut) => {
    if (!statut) return "";
    const s = statut.toLowerCase().trim();

    if (s.includes("attente")) return "en_attente";
    if (s.includes("cours")) return "en_cours";
    if (s.includes("term")) return "terminee";
    if (s.includes("annul")) return "annulee";
    return s;
  };

  // Filtrage et pagination
  useEffect(() => {
    const filtered = allInterventions.filter(
      (i) => normalizeStatut(i.statut) === activeTab
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    setDisplayedInterventions(paginated);
  }, [allInterventions, activeTab, currentPage]);

  const totalFilteredInterventions = allInterventions.filter(
    (i) => normalizeStatut(i.statut) === activeTab
  ).length;
  const totalPages = Math.ceil(totalFilteredInterventions / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStatutChange = async (interventionId, newStatut) => {
    try {
      await axios.put(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/${interventionId}`,
        { statut: newStatut },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      toast.success("Statut mis à jour avec succès");
      fetchInterventions(); // Recharger les données
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour"
      );
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold uppercase text-center mb-8">
          Mes Interventions
        </h1>

        {/* Onglets de chargement */}
        <div className="flex flex-wrap justify-center mb-6">
          {["en_attente", "en_cours", "terminee", "annulee"].map((statut) => (
            <div
              key={statut}
              className={`py-2 px-4 mx-1 mb-2 rounded ${
                activeTab === statut ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <div className="invisible">
                {statut === "en_attente" && "En attente"}
                {statut === "en_cours" && "En cours"}
                {statut === "terminee" && "Terminées"}
                {statut === "annulee" && "Annulées"}
              </div>
            </div>
          ))}
        </div>

        {/* Cartes de chargement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="border border-blue-300 p-4 rounded-lg shadow-md w-full bg-blue-50 animate-pulse"
            >
              {/* Titre */}
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />

              {/* Lignes de texte */}
              <div className="space-y-3">
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 ml-2" />
                </div>
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-orange-200 rounded w-3/4 ml-2" />
                </div>
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 ml-2" />
                </div>
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-orange-200 rounded w-3/4 ml-2" />
                </div>
              </div>

              {/* Boutons */}
              <div className="mt-4 flex justify-between">
                <div className="h-8 bg-gray-300 rounded w-24" />
                <div className="h-8 bg-orange-300 rounded w-24" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto xl:px-4">
      <h1 className="text-2xl font-bold uppercase text-center mb-8">
        Mes Interventions
      </h1>

      {/* Onglets */}
      <div className="flex flex-wrap justify-center mb-6">
        {["en_attente", "en_cours", "terminee", "annulee"].map((statut) => (
          <button
            key={statut}
            onClick={() => {
              setActiveTab(statut);
              setCurrentPage(1);
            }}
            className={`py-2 px-4 mx-1 mb-2 rounded ${
              activeTab === statut
                ? "bg-orange-500 text-white font-bold"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {statut === "en_attente" && "En attente"}
            {statut === "en_cours" && "En cours"}
            {statut === "terminee" && "Terminées"}
            {statut === "annulee" && "Annulées"}
          </button>
        ))}
      </div>

      {/* Liste des interventions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedInterventions.length > 0 ? (
          displayedInterventions.map((intervention) => (
            <InterventionCard
              key={intervention._id}
              intervention={intervention}
              onStatutChange={handleStatutChange}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucune intervention{" "}
            {activeTab === "en_cours" ? "en cours" : activeTab} trouvée
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="inline-flex rounded-md shadow">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-l-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-orange-600 hover:bg-blue-50"
              }`}
            >
              Précédent
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 border-t border-b ${
                  page === currentPage
                    ? "bg-orange-500 text-white"
                    : "bg-white text-orange-600 hover:bg-orange-50"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-r-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-blue-600 hover:bg-blue-50"
              }`}
            >
              Suivant
            </button>
          </nav>
        </div>
      )}

      <div className="text-center mt-4 text-gray-500">
        Affichage des interventions{" "}
        {Math.min(
          (currentPage - 1) * itemsPerPage + 1,
          totalFilteredInterventions
        )}
        -{Math.min(currentPage * itemsPerPage, totalFilteredInterventions)} sur{" "}
        {totalFilteredInterventions}
      </div>
    </div>
  );
}
