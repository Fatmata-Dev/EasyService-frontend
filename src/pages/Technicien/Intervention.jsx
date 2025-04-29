import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import InterventionCard from "../../components/cards/InterventionCard";
import { motion } from "framer-motion";

export default function Intervention() {
  const [user, setUser] = useState(null);
  const [allInterventions, setAllInterventions] = useState([]);
  const [displayedInterventions, setDisplayedInterventions] = useState([]);
  const [interventionsParStatut, setInterventionsParStatut] = useState([
    { statut: "En attente", nombre: 0 },
    { statut: "En cours", nombre: 0 },
    { statut: "Terminé", nombre: 0 },
    { statut: "Annulé", nombre: 0 },
  ]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeTab, setActiveTab] = useState("en_cours");

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
        console.log(intervention)
        const demandeObj = intervention || {};
        const serviceObj = demandeObj.service || { nom: "Service inconnu" };
        const clientObj = demandeObj.client || {
          prenom: "Client",
          nom: "inconnu",
        };

        return {
          _id: intervention._id,
          dateIntervention: intervention.dateIntervention || "Non définie",
          heureDebut: intervention.heureDebut || "À définir",
          heureFin: intervention.heureFin || "À définir",
          etatExecution: intervention.etatExecution || "non_commencee", // Correction ici
          service: serviceObj.nom,
          client: `${clientObj.prenom} ${clientObj.nom}`,
          adresse: demandeObj.adresse || "Adresse non spécifiée",
          description: demandeObj.description || "Aucune description",
          note: intervention.note || null,
          commentaire: intervention.commentaire || "",
          clientId: intervention.client._id,
          demandeId: intervention._id,
          technicienId: intervention.technicien._id,
          serviceId: intervention.service._id,
          adminId: intervention?.admin?._id,
          tarif: intervention.tarif
        };
      });

      // Compter les interventions par statut
      const counts = {
        "En attente": 0,
        "En cours": 0,
        Terminé: 0,
        Annulé: 0,
      };

      interventionsAvecDetails.forEach((intervention) => {
        const statutNormalise = normalizeStatut(intervention.etatExecution);

        if (statutNormalise === "non_commencee") counts["En attente"]++;
        else if (statutNormalise === "en_cours") counts["En cours"]++;
        else if (statutNormalise === "terminee") counts["Terminé"]++;
        else if (statutNormalise === "annulee") counts["Annulé"]++;
      });

      setAllInterventions(interventionsAvecDetails);
      setInterventionsParStatut(
        Object.entries(counts).map(([statut, nombre]) => ({
          statut, // Changé de etatExecution à statut pour correspondre à l'état initial
          nombre,
        }))
      );
    } catch (err) {
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

  const normalizeStatut = (statut) => {
    if (!statut) return "";
    const s = statut.toLowerCase().trim();

    if (s.includes("commencee")) return "non_commencee";
    if (s.includes("cours")) return "en_cours";
    if (s.includes("term")) return "terminee";
    if (s.includes("annul")) return "annulee";
    return s;
  };

  useEffect(() => {
    const filtered = allInterventions.filter(
      (i) => normalizeStatut(i.etatExecution) === activeTab // Changé de statut à etatExecution
    );
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    setDisplayedInterventions(paginated);
  }, [allInterventions, activeTab, currentPage]);

  const totalFilteredInterventions = allInterventions.filter(
    (i) => normalizeStatut(i.etatExecution) === activeTab // Changé de statut à etatExecution
  ).length;
  const totalPages = Math.ceil(totalFilteredInterventions / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold uppercase text-center mb-8">
          Mes Interventions
        </h1>

        <div className="flex flex-wrap justify-center mb-6">
          {["non_commencee", "en_cours", "terminee", "annulee"].map(
            (statut) => (
              <div
                key={statut}
                className={`py-2 px-4 mx-1 mb-2 rounded ${
                  activeTab === statut ? "bg-gray-300" : "bg-gray-200"
                }`}
              >
                <div className="invisible">
                  {statut === "non_commencee" && "En attente"}
                  {statut === "en_cours" && "En cours"}
                  {statut === "terminee" && "Terminées"}
                  {statut === "annulee" && "Annulées"}
                </div>
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="border border-blue-300 p-4 rounded-lg shadow-md w-full bg-blue-50 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-4" />
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

      {/* Onglets avec compteurs */}
      <div className="flex flex-wrap justify-center mb-6">
        {[
          { id: "non_commencee", label: "En attente", statutKey: "En attente" },
          { id: "en_cours", label: "En cours", statutKey: "En cours" },
          { id: "terminee", label: "Terminées", statutKey: "Terminé" },
          { id: "annulee", label: "Annulées", statutKey: "Annulé" },
        ].map((tab) => {
          const statutData = interventionsParStatut.find(
            (item) => item.statut === tab.statutKey
          );
          const count = statutData ? statutData.nombre : 0;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`py-2 px-4 mx-1 mb-2 rounded flex items-center ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white font-bold"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 font-bold text-md ${
                  activeTab === tab.id ? "text-white" : "text-orange-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedInterventions.length > 0 ? (
          displayedInterventions.map((intervention) => (
            <InterventionCard
              key={intervention._id}
              intervention={intervention}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucune intervention{" "}
            {activeTab === "en_cours" ? "en cours" : activeTab} trouvée
          </div>
        )}
      </div>

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
