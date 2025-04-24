import { Link } from "react-router-dom";
import { FaLongArrowAltRight, FaBell, FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import InterventionCard from "../../components/cards/InterventionCard";

const DashboardTechniciens = () => {
  const [user, setUser] = useState(null);
  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
    } catch {
      return dateString; // Retourne la date originale si le parsing échoue
    }
  };

  const [loading, setLoading] = useState(true);
  const [interventions, setInterventions] = useState([]);
  // const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({
    enCours: 0,
    terminees: 0,
    enAttente: 0,
  });

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    setUser(userData);
  }, []);

  const fetchInterventions = useCallback(async () => {
    try {
      if (!user || user.role !== "technicien") return;
      const response = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/technicien/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
          timeout: 5000, // 5 secondes timeout
        }
      );

      // Calcul des statistiques
      const counts = {
        enCours: 0,
        terminees: 0,
        enAttente: 0,
      };

      console.log(response.data);

      response.data.forEach((interv) => {
        if (interv.etatExecution === "en_cours") counts.enCours++;
        else if (interv.etatExecution === "terminee") counts.terminees++;
        else if (interv.etatExecution === "non_commencee") counts.enAttente++;
      });

      setStats(counts);
      setInterventions(response.data.slice(0, 5)); // On ne garde que les 5 premières
    } catch (error) {
      toast.error("Erreur lors du chargement des interventions");
      console.error(error);
    }
  }, [user]);

  // const fetchMessages = useCallback(async () => {
  //   try {
  //     const response = await axios.get(
  //       `https://easyservice-backend-iv29.onrender.com/api/messages/recus`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //       }
  //     );
  //     setMessages(response.data.slice(0, 3)); // 3 derniers messages
  //   } catch (error) {
  //     console.error("Erreur messages:", error);
  //   }
  // }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchInterventions()]);
      } catch (error) {
        console.error("Erreur chargement données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchInterventions]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header avec stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="En cours"
          value={stats.enCours}
          color="bg-blue-100 text-blue-800"
          icon={<FaBell className="text-blue-500" />}
        />
        <StatCard
          title="Terminées"
          value={stats.terminees}
          color="bg-green-100 text-green-800"
          icon={<FaBell className="text-green-500" />}
        />
        <StatCard
          title="En attente"
          value={stats.enAttente}
          color="bg-yellow-100 text-yellow-800"
          icon={<FaBell className="text-yellow-500" />}
        />
      </div>

      {/* Dernières interventions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Dernières interventions
          </h2>
          <Link
            to="/technicien/interventions"
            className="text-orange-500 hover:underline flex items-center"
          >
            Voir tout <FaLongArrowAltRight className="ml-2" />
          </Link>
        </div>

        {interventions.length > 0 ? (
          <div className="space-y-4">
            {interventions.map((intervention) => (
              <InterventionCard
                key={intervention._id}
                intervention={{
                  ...intervention,
                  client: `${intervention.client?.prenom || ""} ${
                    intervention.client?.nom || ""
                  }`,
                  service: intervention.service?.nom || "Service inconnu",
                }}
                compact
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">
            Aucune intervention récente
          </p>
        )}
      </div>

      {/* Messages et calendrier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">
              Messages récents
            </h2>
            <Link
              to="/technicien/messages"
              className="text-orange-500 hover:underline flex items-center"
            >
              Voir tout <FaLongArrowAltRight className="ml-2" />
            </Link>
          </div>

          {/* {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg._id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-3">
                      <FaEnvelope className="text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold">{msg.expediteur?.prenom || 'Admin'} {msg.expediteur?.nom || ''}</p>
                      <p className="text-gray-600 text-sm">{msg.contenu}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        {formatDate(msg.dateEnvoi)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">Aucun message récent</p>
          )} */}
        </div>

        {/* Calendrier/Prochaines interventions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Prochaines interventions
          </h2>
          {interventions.filter(
            (i) => i.statut === "En attente" || i.statut === "En cours"
          ).length > 0 ? (
            <div className="space-y-3">
              {interventions
                .filter(
                  (i) => i.statut === "En attente" || i.statut === "En cours"
                )
                .slice(0, 3)
                .map((intervention) => (
                  <div
                    key={intervention._id}
                    className="border-b pb-3 last:border-0"
                  >
                    <p className="font-semibold">
                      {intervention.service?.nom || "Service"}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {formatDate(intervention.dateIntervention)} -{" "}
                      {intervention.heureDebut || ""}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                        intervention.statut === "En cours"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {intervention.statut}
                    </span>
                  </div>
                ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aucune intervention programmée
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Composant pour les cartes de statistiques
const StatCard = ({ title, value, color, icon }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
    <div className={`p-3 rounded-full mr-4 ${color}`}>{icon}</div>
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

export default DashboardTechniciens;
