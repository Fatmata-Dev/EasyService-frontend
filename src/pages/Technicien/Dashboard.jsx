import { Link } from "react-router-dom";
import { FaLongArrowAltRight, FaBell, FaEnvelope } from "react-icons/fa";
import { useState, useEffect, useMemo } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import InterventionCard from "../../components/cards/InterventionCard";
import { useGetDemandeForTechnicienIdQuery } from "../../API/demandesApi";
import { useGetReceivedMessagesQuery } from "../../API/messagesApi";
import { useAuth } from "../../context/useAuth";

const DashboardTechniciens = () => {
  const { user } = useAuth();

  const {
    data: demandes = [],
    isLoading: loadingDemandes,
    error: errorDemandes,
  } = useGetDemandeForTechnicienIdQuery(user?._id, { skip: !user });

  console.log(demandes);

  const {
    data: messagesData = { data: [] },
    isLoading: loadingMessages,
    error: errorMessages,
  } = useGetReceivedMessagesQuery(user?._id, { skip: !user });

  const nextIntervention = useMemo(() => {
    if (!demandes.length) return null;
    
    const upcoming = demandes
      .filter(i => ["en_attente", "en_cours"].includes(i.statut) && i.dateIntervention)
      .sort((a, b) => new Date(a.dateIntervention) - new Date(b.dateIntervention));
    
    return upcoming.length > 0 ? upcoming[0] : null;
  }, [demandes]);

  const stats = useMemo(() => {
    const counts = { enCours: 0, terminees: 0, enAttente: 0 };
    demandes.forEach((demande) => {
      if (demande.etatExecution === "en_cours") counts.enCours++;
      else if (demande.etatExecution === "terminee") counts.terminees++;
      else if (demande.etatExecution === "non_commencee") counts.enAttente++;
    });
    return counts;
  }, [demandes]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    try {
      return format(parseISO(dateString), "dd/MM/yyyy - HH:mm", { locale: fr });
    } catch {
      return dateString;
    }
  };

  if (loadingDemandes || loadingMessages) {
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
          title="En attente"
          value={stats.enAttente}
          color="bg-yellow-100 text-yellow-800"
          icon={<FaBell className="text-yellow-500" />}
        />
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
        
      </div>

{/* Calendrier / prochaines interventions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Prochaines interventions
          </h2>
  
          {nextIntervention ? (
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-1/2">
              </div>
              
              <div className="w-full md:w-1/2">
                {demandes.slice(0, 1).map((intervention) => (
                  <InterventionCard
                    key={intervention._id}
                    intervention={{
                      ...intervention,
                      client: `${intervention.client?.prenom || ""} ${intervention.client?.nom || ""}`,
                      service: intervention.service?.nom || "Service inconnu",
                    }}
                    compact
                  />
                ))}
          </div>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              Aucune intervention programmée
            </p>
          )}
        </div>


      {/* Messages et dernières interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800">Messages récents</h2>
            <Link
              to="/technicien/messages"
              className="text-orange-500 hover:underline flex items-center"
            >
              Voir tout <FaLongArrowAltRight className="ml-2" />
            </Link>
          </div>

          {messagesData.data.length > 0 ? (
            <div className="space-y-3">
              {messagesData.data.slice(0, 3).map((msg) => (
                <div key={msg._id} className="border-b pb-3 last:border-0">
                  <div className="flex items-start">
                    <div className="bg-orange-100 p-2 rounded-full mr-3">
                      <FaEnvelope className="text-orange-500" />
                    </div>
                    <div>
                      <p className="font-semibold">
                        {msg.expediteur?.prenom || "Admin"} {msg.expediteur?.nom || ""}
                      </p>
                      <p className="text-gray-600 text-sm line-clamp-2">{msg.contenu}</p>
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
          )}
        </div>


        {/* Dernières interventions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Dernières interventions</h2>
          <Link
            to="/technicien/interventions"
            className="text-orange-500 hover:underline flex items-center"
          >
            Voir tout <FaLongArrowAltRight className="ml-2" />
          </Link>
        </div>

        {demandes.length > 0 ? (
          <div className="space-y-4">
            {demandes.slice(0, 1).map((intervention) => (
              <InterventionCard
                key={intervention._id}
                intervention={{
                  ...intervention,
                  client: `${intervention.client?.prenom || ""} ${intervention.client?.nom || ""}`,
                  service: intervention.service?.nom || "Service inconnu",
                }}
                compact
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-4">Aucune intervention récente</p>
        )}
      </div>
        
      </div>

      

    </div>
  );
};

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
