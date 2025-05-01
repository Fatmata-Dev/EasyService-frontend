import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  useGetServicesQuery,
  useGetAvisQuery
} from "../../API/servicesApi";
import { useGetDemandesQuery } from "../../API/demandesApi";
import { useGetTechniciensQuery } from "../../API/authApi";
import { useGetReceivedMessagesQuery } from "../../API/messagesApi";
import { motion } from "framer-motion";
import { Star, MessageSquare, User } from "react-feather";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function DashboardAdmin() {
  // Données
  const { data: demandes = [], isLoading: isLoadingDemandes } = useGetDemandesQuery();
  const { data: services = [], isLoading: isLoadingServices } = useGetServicesQuery();
  const { data: techniciens = [], isLoading: isLoadingTechniciens } = useGetTechniciensQuery();
  const { data: avis = [], isLoading: isLoadingAvis } = useGetAvisQuery();
  const { data: messagesResponse = [], isLoading: isLoadingMessages } = useGetReceivedMessagesQuery();
  
  // Extraction des messages depuis la réponse
  const messages = messagesResponse.data || [];

  // Créer un map des services pour un accès rapide
  const servicesMap = services?.reduce((acc, service) => {
    acc[service._id] = service;
    return acc;
  }, {});

  // Fusionner les avis avec les données du service
  const enrichedAvis = avis?.map(avisItem => {
    const service = servicesMap?.[avisItem.service];
    return {
      ...avisItem,
      service: service || null
    };
  });

  // États
  const [demandesParStatut, setDemandesParStatut] = useState([]);

  // Fonction utilitaire
  const normaliserStatut = (statut) => {
    if (!statut) return "En attente";
    const s = statut.toLowerCase().trim();
    if (s.includes("attente")) return "En attente";
    if (s.includes("cours")) return "En cours";
    if (s.includes("term")) return "Terminé";
    // if (s.includes("refus") || s.includes("rejet")) return "Refusé";
    return statut;
  };

  // Calcul des statistiques
  useEffect(() => {
    if (!isLoadingDemandes) {
      const counts = {
        "En attente": 0,
        "En cours": 0,
        "Terminé": 0,
        // "Refusé": 0
      };

      demandes.forEach(demande => {
        const statut = normaliserStatut(demande.statut);
        if (counts[statut] !== undefined) counts[statut]++;
      });

      setDemandesParStatut(
        Object.entries(counts).map(([statut, nombre]) => ({ statut, nombre })
      ));
    }
  }, [demandes, isLoadingDemandes]);

  // Données pour les graphiques
  const notesDistribution = [
    { name: "5 étoiles", value: avis.filter(a => a.note === 5).length },
    { name: "4 étoiles", value: avis.filter(a => a.note === 4).length },
    { name: "3 étoiles", value: avis.filter(a => a.note === 3).length },
    { name: "2 étoiles", value: avis.filter(a => a.note === 2).length },
    { name: "1 étoile", value: avis.filter(a => a.note === 1).length },
  ];

  const loading = isLoadingDemandes || isLoadingServices || isLoadingTechniciens || isLoadingAvis || isLoadingMessages;

  if (loading) {
    return (
      <div className="sm:p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow animate-pulse h-28" />
          ))}
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded-lg shadow animate-pulse h-96" />
          <div className="bg-white p-4 rounded-lg shadow animate-pulse h-96" />
        </div>

        {/* Avis et Messages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-4 rounded-lg shadow animate-pulse h-96" />
          <div className="bg-white p-4 rounded-lg shadow animate-pulse h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="sm:p-6">
      <h1 className="text-2xl font-bold mb-6">Tableau de Bord</h1>
      
      {/* Statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <StatCard 
          icon={<User size={24} />}
          title="Services" 
          value={services.length} 
          color="bg-blue-500" 
        />
        <StatCard 
          icon={<User size={24} />}
          title="Demandes" 
          value={demandes.length} 
          color="bg-purple-500" 
        />
        <StatCard 
          icon={<User size={24} />}
          title="Techniciens" 
          value={techniciens.length} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={<Star size={24} />}
          title="Avis" 
          value={avis.length} 
          color="bg-yellow-500" 
        />
      </div>

      {/* Graphiques côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Demandes par statut */}
        <div className="bg-white p-2 sm:p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Demandes par statut</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demandesParStatut}>
                <XAxis dataKey="statut" className="text-xs sm:text-md font-semibold" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="nombre" fill="#8884d8">
                  <LabelList dataKey="nombre" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution des notes */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Notes des clients</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={notesDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {notesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Avis et Messages côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Derniers avis */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Derniers avis</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {enrichedAvis.slice(0, 3).map(avis => (
              <AvisItem key={avis._id} avis={avis} />
            ))}
            {enrichedAvis.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun avis pour le moment</p>
            )}
          </div>
        </div>

        {/* Messages récents */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Messages récents</h2>
            <Link to="/admin/messages" className="text-blue-500 hover:underline">Voir tout</Link>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {messages.slice(0, 3).map(message => (
              <MessageItem key={message._id} message={message} /> 
              // || console.log(message)
            ))}
            {messages.length === 0 && (
              <p className="text-gray-500 text-center py-4">Aucun message pour le moment</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants supplémentaires
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`${color} text-white p-4 rounded-lg shadow`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm opacity-80">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-2 bg-white bg-opacity-20 rounded-full">
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

// Composant pour les avis
function AvisItem({ avis }) {

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const navigate = useNavigate();

  return (
    <div className="border-b pb-3 last:border-0 cursor-pointer hover:bg-gray-100 p-2 rounded" onClick={() => navigate(`/admin/services/${avis?.service?._id}`)}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium">{avis.client?.nom || "Anonyme"}</p>
          <p className="text-sm text-gray-500">{avis.service?.nom || "Service supprimé"}</p>
        </div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={16} 
              className={i < avis.note ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
            />
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center flex-wrap gap-2 w-full">
      <p className="flex-1 mt-1 text-sm line-clamp-1">{avis.commentaire || "Aucun commentaire"}</p>
        <p className=" text-sm text-gray-500 w-fit">{formatDate(avis.dateSoumission)}</p>
      </div>
    </div>
  );
}

// Fonction pour le composant MessageItem
function MessageItem({ message }) {
  // Formatage de la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const navigate = useNavigate();

  const { user } = useAuth();
  const currentUser = user || {};
  
  // Vérification si le message est non lu pour l'utilisateur actuel
  const isUnread = message.destinataires?.some(
    destinataire => destinataire?.utilisateur === currentUser._id && !destinataire?.lu
  );

  return (
    <div className={`flex gap-2 border border-gray-200 rounded-lg p-2 sm:p-4 hover:bg-gray-100 cursor-pointer ${
      isUnread ? "bg-blue-50 font-semibold" : ""
    }`} onClick={() => navigate(`/admin/messages/${message._id}`)}>
      <div className="bg-blue-100 p-2 rounded-full w-fit h-fit">
        <MessageSquare size={18} className="text-blue-500" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center flex-wrap gap-1 mb-1">
          <p className="font-medium line-clamp-1">{message.expediteur?.email || "Expéditeur inconnu"}</p>
          <p className="text-xs text-gray-500">{formatDate(message.createdAt)}</p>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{message.contenu}</p>
      </div>
      {isUnread && (
        <span className="bg-orange-500 w-2 h-2 rounded-full ml-2 mt-1"></span>
      )}
    </div>
  );
}