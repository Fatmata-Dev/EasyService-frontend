import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import DemandesCardClient from "../../components/cards/DemandesCardClient";
import { useGetDemandeForClientIdQuery } from "../../API/demandesApi";
import { useAuth } from "../../context/useAuth";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function Demands() {
  const { user } = useAuth();
  const { data: response = [], refetch } = useGetDemandeForClientIdQuery(user?._id);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Normalisation des statuts
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

  // Préparation des données des demandes
  const demandesAvecDetails = useMemo(() => {
    if (!response) return [];

    return response.map((demande) => {
      const serviceObj = typeof demande.service === "object" 
        ? demande.service 
        : { _id: demande.service, nom: "Service inconnu" };

      const clientObj = typeof demande.client === "object"
        ? demande.client
        : { _id: demande.client, prenom: "Client", nom: "inconnu" };

      const technicienObj = typeof demande.technicien === "object"
        ? demande.technicien
        : { _id: demande.technicien, prenom: "Technicien", nom: "inconnu" };

      return {
        ...demande,
        service: serviceObj?.nom || "Service non spécifié",
        serviceId: serviceObj?._id || demande.service,
        clientPrenom: clientObj?.prenom || "Client non spécifié",
        clientNom: clientObj?.nom || "",
        technicienPrenom: technicienObj?.prenom || "",
        technicienNom: technicienObj?.nom || "",
        statutNormalise: normalizeStatut(demande.statut),
      };
    });
  }, [response]);

  // Calcul des compteurs par statut
  const demandesParStatut = useMemo(() => {
    const statuts = [
      "En attente", 
      "Accepté", 
      "En cours", 
      "Terminé", 
      "Refusé", 
      "Annulé"
    ];

    return statuts.map(statut => {
      const statutNormalise = normalizeStatut(statut);
      const nombre = demandesAvecDetails.filter(
        d => d.statutNormalise === statutNormalise
      ).length;
      return { statut, nombre };
    });
  }, [demandesAvecDetails]);

  // Filtrage et pagination
  const [activeTab, setActiveTab] = useState("en_attente");
  
  const { displayedDemandes, totalFilteredDemandes, totalPages } = useMemo(() => {
    const filtered = demandesAvecDetails.filter(
      d => d.statutNormalise === activeTab
    );
    const total = filtered.length;
    const pages = Math.ceil(total / itemsPerPage);
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);
    
    return {
      displayedDemandes: paginated,
      totalFilteredDemandes: total,
      totalPages: pages
    };
  }, [demandesAvecDetails, activeTab, currentPage]);

  // Gestion du changement de page
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Réinitialiser la page quand on change d'onglet
  useEffect(() => {
    setCurrentPage(1);
    refetch();
  }, [activeTab, refetch]);

  // Loading state
  if (!response) {
    return (
      <div className="container mx-auto xl:px-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold uppercase text-center">Demandes</h1>
          <div className="bg-gray-200 w-[500px] h-[25px] rounded animate-pulse"></div>
        </div>

        <div className="flex flex-wrap justify-center mb-6 gap-2">
          {["En attente", "Accepté", "En cours", "Annulé", "Refusé", "Terminé"].map(
            (statut) => (
              <div
                key={statut}
                className="py-2 px-4 rounded bg-gray-200 animate-pulse"
                style={{ width: '120px', height: '40px' }}
              ></div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="border border-gray-200 p-4 rounded-lg shadow-md w-full bg-white animate-pulse"
              style={{ height: '300px' }}
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="md:container md:mx-auto xl:px-4">
      <div className="flex sm:justify-between justify-center items-center mb-3 flex-wrap gap-2">
        <h1 className="text-2xl font-bold uppercase text-center">Demandes</h1>
        <h2 className="text-md bg-orange-100 rounded p-2">
          Pour réserver un service allez dans{" "}
          <Link to={"/client/services"} className="text-orange-500 underline">
            Services
          </Link>{" "}
        </h2>
      </div>

      {/* Onglets avec compteurs */}
      <div className="flex flex-wrap justify-center mb-6 gap-2">
        {[
          { id: "en_attente", label: "En attente", statutKey: "En attente" },
          { id: "acceptee", label: "Acceptées", statutKey: "Accepté" },
          { id: "en_cours", label: "En cours", statutKey: "En cours" },
          { id: "terminee", label: "Terminées", statutKey: "Terminé" },
          { id: "annulee", label: "Annulées", statutKey: "Annulé" },
          { id: "refusee", label: "Refusées", statutKey: "Refusé" },
        ].map((tab) => {
          const statutData = demandesParStatut.find(
            (item) => item.statut === tab.statutKey
          );
          const count = statutData?.nombre || 0;

          return (
            <button
              key={tab.id}
              className={`py-2 px-4 rounded flex items-center transition-colors ${
                activeTab === tab.id
                  ? "bg-orange-500 text-white font-bold"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {count > 0 && (
                <span
                className={`ml-2 font-bold text-md ${
                  activeTab === tab.id ? "text-white" : "text-orange-500"
                }`}
              >
                {count}
              </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Liste des demandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedDemandes.length > 0 ? (
          displayedDemandes.map((demande) => (
            <DemandesCardClient 
              key={demande._id} 
              demande={demande} 
              className="hover:shadow-lg transition-shadow"
              onRefresh={refetch}
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
        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="text-sm text-gray-500">
            Affichage {Math.min((currentPage - 1) * itemsPerPage + 1, totalFilteredDemandes)}-
            {Math.min(currentPage * itemsPerPage, totalFilteredDemandes)} sur {totalFilteredDemandes} demandes
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-orange-600 hover:bg-orange-50"
              }`}
            >
              <FaChevronLeft />
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }

              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-10 h-10 rounded-md ${
                    page === currentPage
                      ? "bg-orange-500 text-white"
                      : "bg-white text-orange-600 hover:bg-orange-50 border"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white text-orange-600 hover:bg-orange-50"
              }`}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}