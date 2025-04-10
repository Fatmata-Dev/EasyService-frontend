import { useState, useEffect } from "react";
import DemandesCard from "../../components/cards/DemandesCards";
import axios from "axios";
import toast from "react-hot-toast";

export default function DemandesAdmin() {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    try {
      // 1. Récupérer les demandes
      const response = await axios.get("http://localhost:4000/api/demandes", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      //console.log(response.data)

      // 2. Pour chaque demande, récupérer les données associées
      const demandesAvecDetails = await Promise.all(
        response.data.map(async (demande) => {
          try {
            const [serviceResponse, clientResponse] = await Promise.all([
              demande.service
                ? axios.get(
                    `http://localhost:4000/api/services/${demande.service._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "authToken"
                        )}`,
                      },
                    }
                  )
                : Promise.resolve({ data: {} }),

              demande.client
                ? axios.get(
                    `http://localhost:4000/api/auth/users/${demande.client._id}`,
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "authToken"
                        )}`,
                      },
                    }
                  )
                : Promise.resolve({ data: {} }),
            ]);

            return {
              _id: demande._id,
              numeroDemande: demande.numeroDemande,
              service:
                serviceResponse.data.nom ||
                demande.titre ||
                "Service non spécifié",
              date: demande.dateDemande || new Date().toLocaleDateString(),
              dateIntervention:
                demande.dateIntervention || new Date().toLocaleDateString(),
              clientPrenom: clientResponse.data.prenom || "Client non spécifié",
              clientNom: clientResponse.data.nom || "",
              statut: demande.statut,
              categorie: demande.categorieService,
              description: demande.description,
            };
          } catch (error) {
            console.error("Erreur lors de la récupération des détails:", error);
            return {
              _id: demande._id,
              numeroDemande: demande.numeroDemande,
              service: "Erreur de chargement",
              date: demande.dateDemande || new Date().toLocaleDateString(),
              dateIntervention:
                demande.dateIntervention || new Date().toLocaleDateString(),
              clientPrenom: "Erreur de chargement",
              clientNom: "",
              statut: demande.statut || "",
              categorie: demande.categorieService || "",
              description: demande.description || "",
            };
          }
        })
      );

      setDemandes(demandesAvecDetails);
      //console.log("Demandes avec détails:", demandesAvecDetails);
    } catch (err) {
      toast.error(err.message || "Erreur lors du chargement des demandes");
      // console.error("Erreur API principale:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const [activeTab, setActiveTab] = useState("en_attente");

  const filteredDemandes = demandes.filter(
    (demande) => demande.statut === activeTab
  );
  //console.log("Demandes filtrées:", filteredDemandes);

  if (loading) {
    return <div className="text-center py-10">Chargement en cours...</div>;
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold uppercase text-center pb-6">
        Demandes
      </h1>

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDemandes.length > 0 ? (
          filteredDemandes.map((demande) => (
            <DemandesCard key={demande._id} demande={demande} />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            Aucune demande trouvée pour ce statut
          </div>
        )}
      </div>
    </div>
  );
}
