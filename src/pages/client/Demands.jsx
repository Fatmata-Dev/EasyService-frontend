import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import DemandesCardClient from "../../components/cards/DemandesCardClient";
import { Link } from "react-router-dom";

export default function Demands() {
  const [user, setUser] = useState(null); // État pour stocker les infos utilisateur
  const [allDemandes, setAllDemandes] = useState([]);
  const [displayedDemandes, setDisplayedDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);

      if (!user) return; // Ne pas faire la requête si l'utilisateur n'est pas chargé

      // 1. Récupérer les demandes selon le rôle de l'utilisateur
      let endpoint =
        "https://easyservice-backend-iv29.onrender.com/api/demandes";

      // Si c'est un client, on ne récupère que ses demandes
      if (user.role === "client") {
        endpoint = `https://easyservice-backend-iv29.onrender.com/api/demandes/client/${user.id}`;
      }
      // Si c'est un technicien, on ne récupère que ses demandes assignées
      else if (user.role === "technicien") {
        endpoint = `https://easyservice-backend-iv29.onrender.com/api/demandes/technicien/${user.id}`;
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      // 2. Construire les données finales
      const demandesAvecDetails = response.data.map((demande) => {
        const serviceObj =
          typeof demande.service === "object"
            ? demande.service
            : { _id: demande.service, nom: "Service inconnu" };

        const clientObj =
          typeof demande.client === "object"
            ? demande.client
            : { _id: demande.client, prenom: "Client", nom: "inconnu" };

        const TechnicienObj =
          typeof demande.technicien === "object"
            ? demande.technicien
            : { _id: demande.technicien, prenom: "Technicien", nom: "inconnu" };

        return {
          _id: demande._id,
          numeroDemande: demande.numeroDemande,
          service: serviceObj?.nom || "Service non spécifié",
          date: demande.dateDemande || new Date().toLocaleDateString(),
          dateIntervention:
            demande.dateIntervention || new Date().toLocaleDateString(),
          clientPrenom: clientObj?.prenom || "Client non spécifié",
          clientNom: clientObj?.nom || "",
          statut: demande.statut,
          categorie: demande.categorieService,
          description: demande.description,
          technicienPrenom: TechnicienObj?.prenom || "À définir",
          technicienNom: TechnicienObj?.nom || "",
        };
      });

      setAllDemandes(demandesAvecDetails);
    } catch (err) {
      console.error("Erreur:", err);
      toast.error(err.response?.data?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }, [user]); // Dépendance sur user

  useEffect(() => {
    if (user) {
      // Ne charger que si l'utilisateur est disponible
      fetchServices();
    }
  }, [fetchServices, user]);

  const [activeTab, setActiveTab] = useState("en_attente");

  // Ajoutez cette fonction utilitaire
  const normalizeStatut = (statut) => {
    if (!statut) return "";
    const s = statut.toLowerCase().trim();

    if (s.includes("attente")) return "en_attente";
    if (s.includes("cours")) return "en_cours";
    if (s.includes("annul")) return "annulee";
    if (s.includes("refus")) return "refusee";
    if (s.includes("term")) return "terminee";
    return s;
  };

  // Calcul de la pagination
  useEffect(() => {
    // Filtrer avec normalizeStatut
    const filtered = allDemandes.filter(
      (d) => normalizeStatut(d.statut) === activeTab
    );

    // Puis paginer les résultats
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    setDisplayedDemandes(paginated);
  }, [allDemandes, activeTab, currentPage]);

  // Calcul du total doit aussi utiliser normalizeStatut
  const totalFilteredDemandes = allDemandes.filter(
    (d) => normalizeStatut(d.statut) === activeTab
  ).length;
  const totalPages = Math.ceil(totalFilteredDemandes / itemsPerPage);

  // const handleTabChange = (statut) => {
  //   setActiveTab(statut);
  //   setCurrentPage(1); // Reset à la première page quand on change de statut
  // };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="container mx-auto xl:px-4">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold uppercase text-center">Demandes</h1>
          <div className="bg-gray-200 w-[500px] h-[25px] rounded animate-pulse "></div>
        </div>

        {/* Onglets de chargement */}
        <div className="flex flex-wrap justify-center mb-6">
          {["en_attente", "en_cours", "annulee", "refusee", "terminee"].map(
            (statut) => (
              <div
                key={statut}
                className={`py-2 px-4 mx-1 mb-2 rounded ${
                  activeTab === statut ? "bg-gray-300" : "bg-gray-200"
                }`}
              >
                <div className="invisible">
                  {statut === "en_attente" && "En attente"}
                  {statut === "en_cours" && "En cours"}
                  {statut === "annulee" && "Annulées"}
                  {statut === "refusee" && "Refusées"}
                  {statut === "terminee" && "Terminées"}
                </div>
              </div>
            )
          )}
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
    <div className="md:container md:mx-auto xl:px-4">
      <div className="flex sm:justify-between justify-center items-center mb-3 lg:flex-wrap gap-2">
        <h1 className="text-2xl font-bold uppercase text-center">Demandes</h1>

        <h2 className="text-md bg-orange-100 rounded p-2">
          Pour réserver un service rendez-vous sur la partie{" "}
          <Link to={"/client/services"} className="text-orange-500 underline">
            Services
          </Link>{" "}
        </h2>
      </div>

      {/* Onglets */}
      <div className="flex flex-wrap justify-center mb-6">
        {["en_attente", "en_cours", "annulee", "refusee", "terminee"].map(
          (statut) => (
            <button
              key={statut}
              className={`py-2 px-4 mx-1 mb-2 rounded ${
                activeTab === statut
                  ? "bg-orange-500 text-white font-bold"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={() => setActiveTab(statut)}
            >
              {statut === "en_attente" && "En attente"}
              {statut === "en_cours" && "En cours"}
              {statut === "annulee" && "Annulées"}
              {statut === "refusee" && "Refusées"}
              {statut === "terminee" && "Terminées"}
            </button>
          )
        )}
      </div>

      {/* Liste des demandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-3 xl:gap-5">
        {displayedDemandes.length > 0 ? (
          displayedDemandes.map((demande) => (
            <DemandesCardClient key={demande._id} demande={demande} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            {loading
              ? "Chargement..."
              : "Aucune demande trouvée pour ce statut"}
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
