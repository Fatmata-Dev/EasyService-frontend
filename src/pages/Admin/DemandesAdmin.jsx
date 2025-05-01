import { useState, useEffect } from "react";
import DemandesCard from "../../components/cards/DemandesCards";
import toast from "react-hot-toast";
import {
  useGetDemandesQuery,
} from "../../API/demandesApi";

export default function DemandesAdmin() {
  // Utilisation des hooks RTK Query
  const {
    data: allDemandes = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useGetDemandesQuery();

  const [displayedDemandes, setDisplayedDemandes] = useState([]);
  const [demandesParStatut, setDemandesParStatut] = useState([
    { statut: "En attente", nombre: 0 },
    { statut: "Acceptée", nombre: 0 },
    { statut: "En cours", nombre: 0 },
    { statut: "Terminé", nombre: 0 },
    { statut: "Refusé", nombre: 0 },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [activeTab, setActiveTab] = useState("en_attente");

  // Transformation des données
  useEffect(() => {
    if (!isLoading && !isError) {
      const demandesAvecDetails = allDemandes.map((demande) => {
        const serviceObj = typeof demande.service === "object"
          ? demande.service
          : { _id: demande.service, nom: "Service inconnu" };

        const clientObj = typeof demande.client === "object"
          ? demande.client
          : { _id: demande.client, prenom: "Client", nom: "inconnu" };

        const TechnicienObj = typeof demande.technicien === "object"
          ? demande.technicien
          : { _id: demande.technicien, prenom: "Technicien", nom: "inconnu" };

        return {
          ...demande,
          _id: demande._id,
          numeroDemande: demande.numeroDemande,
          service: serviceObj?.nom || "Service non spécifié",
          date: demande.dateDemande || new Date().toLocaleDateString(),
          dateIntervention: demande.dateIntervention || new Date().toLocaleDateString(),
          clientPrenom: clientObj?.prenom || "Client non spécifié",
          clientNom: clientObj?.nom || "",
          statut: demande.statut,
          etatExecution: demande.etatExecution,
          categorie: demande.categorieService,
          description: demande.description,
          technicienPrenom: TechnicienObj?.prenom,
          technicienNom: TechnicienObj?.nom || "",
        };
      });

      const counts = {
        "En attente": 0,
        Accepté: 0,
        "En cours": 0,
        Terminé: 0,
        Refusé: 0,
        Annulé: 0,
      };

      demandesAvecDetails.forEach((demande) => {
        const statutNormalise = normalizeStatut(demande.statut);
        let statutAffiche;
        
        if (statutNormalise === "en_attente") statutAffiche = "En attente";
        else if (statutNormalise === "acceptee") statutAffiche = "Accepté";
        else if (statutNormalise === "en_cours") statutAffiche = "En cours";
        else if (statutNormalise === "terminee") statutAffiche = "Terminé";
        else if (statutNormalise === "refusee") statutAffiche = "Refusé";
        else if (statutNormalise === "annulee") statutAffiche = "Annulé";
        else statutAffiche = "Autre";

        if (counts[statutAffiche] !== undefined) {
          counts[statutAffiche]++;
        }
      });

      setDemandesParStatut(
        Object.entries(counts)
          .filter(([statut]) => statut !== "Autre")
          .map(([statut, nombre]) => ({ statut, nombre }))
      );
    }

    if (isError) {
      toast.error(error?.data?.message || "Erreur lors du chargement");
    }
  }, [allDemandes, isLoading, isError, error]);

  // Pagination et filtrage
  useEffect(() => {
    if (!isLoading) {
      const filtered = allDemandes.filter(
        (d) => normalizeStatut(d.statut) === activeTab
      );
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
      setDisplayedDemandes(paginated);
    }
  }, [allDemandes, activeTab, currentPage, isLoading]);

  const normalizeStatut = (statut) => {
    if (!statut) return "";
    const s = statut.toLowerCase().trim();
    if (s.includes("attente")) return "en_attente";
    if (s.includes("accept")) return "acceptee";
    if (s.includes("cours")) return "en_cours";
    if (s.includes("annul")) return "annulee";
    if (s.includes("refus")) return "refusee";
    if (s.includes("term")) return "terminee";
    return s;
  };

  const totalFilteredDemandes = allDemandes.filter(
    (d) => normalizeStatut(d.statut) === activeTab
  ).length;
  const totalPages = Math.ceil(totalFilteredDemandes / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };



  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold uppercase text-center pb-6">
          Demandes
        </h1>

        {/* Onglets de chargement */}
        <div className="flex flex-wrap justify-center mb-6">
          {[
            "en_attente",
            "acceptee",
            "en_cours",
            "annulee",
            "refusee",
            "terminee",
          ].map((statut) => (
            <div
              key={statut}
              className={`py-2 px-4 mx-1 mb-2 rounded ${
                activeTab === statut ? "bg-gray-300" : "bg-gray-200"
              }`}
            >
              <div className="invisible">
                {statut === "en_attente" && "En attente"}
                {statut === "acceptee" && "Acceptées"}
                {statut === "en_cours" && "En cours"}
                {statut === "annulee" && "Annulées"}
                {statut === "refusee" && "Refusées"}
                {statut === "terminee" && "Terminées"}
              </div>
            </div>
          ))}
        </div>

        {/* Cartes de chargement */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-orange-300 p-4 rounded-lg shadow-md w-full bg-orange-50 animate-pulse"
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
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 ml-2" />
                </div>
                <div className="flex">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 ml-2" />
                </div>
                <div className="flex items-center">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-6 bg-gray-300 rounded-full w-24 ml-2" />
                </div>
              </div>

              {/* Boutons */}
              <div className="mt-4 flex justify-between">
                <div className="h-8 bg-gray-300 rounded w-20" />
                <div className="h-8 bg-orange-300 rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold uppercase text-center pb-6">
        Demandes
      </h1>

      {/* Onglets */}
      <div className="flex flex-wrap justify-center mb-6">
        {[
          { id: "en_attente", label: "En attente", statutKey: "En attente" },
          { id: "acceptee", label: "Acceptées", statutKey: "Accepté" },
          { id: "en_cours", label: "En cours", statutKey: "En cours" },
          { id: "annulee", label: "Annulées", statutKey: "Annulé" },
          { id: "refusee", label: "Refusées", statutKey: "Refusé" },
          { id: "terminee", label: "Terminées", statutKey: "Terminé" },
        ].map((tab) => {
          // Trouver le nombre correspondant au statut
          const statutData = demandesParStatut.find(
            (item) => item.statut === tab.statutKey
          );
          const count = statutData ? statutData.nombre : 0;

          return (
            <button
              key={tab.id}
              className={`py-2 px-4 mx-1 mb-2 rounded flex items-center ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white font-bold"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(tab.id)}
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

      {/* Liste des demandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedDemandes.length > 0 ? (
          displayedDemandes.map((demande) => (
            <DemandesCard 
              key={demande._id} 
              demande={demande}
              refetch={refetch}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucune demande trouvée pour ce statut
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
                  : "bg-white text-orange-600 hover:bg-orange-50"
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
                  : "bg-white text-orange-600 hover:bg-orange-50"
              }`}
            >
              Suivant
            </button>
          </nav>
        </div>
      )}

      <div className="text-center mt-4 text-gray-500">
        Affichage des demandes{" "}
        {Math.min((currentPage - 1) * itemsPerPage + 1, totalFilteredDemandes)}-
        {Math.min(currentPage * itemsPerPage, totalFilteredDemandes)} sur{" "}
        {totalFilteredDemandes}
      </div>
    </div>
  );
}
