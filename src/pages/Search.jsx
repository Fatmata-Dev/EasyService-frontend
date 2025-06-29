import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { useGetUserConnetedQuery } from "../API/authApi";
import ServiceCard from '../components/cards/ServiceCard';
import ServiceCardClient from '../components/cards/ServiceCardClient';
import DemandesCard from '../components/cards/DemandesCards';
import DemandesCardClient from '../components/cards/DemandesCardClient';
import InterventionCard from '../components/cards/InterventionCard';
import AvisCard from '../components/cards/AvisCard';
import { fr } from 'date-fns/locale';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: user } = useGetUserConnetedQuery();
  const { results = [], query = '' } = location.state || {};
  
  // État pour gérer le nombre d'éléments affichés par type
  const [displayCount, setDisplayCount] = useState({
    demande: 5,
    message: 5,
    service: 5,
    avis: 5
  });

  // Grouper les résultats par type
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.type]) {
      acc[result.type] = [];
    }
    acc[result.type].push(result);
    // console.log(acc);
    return acc;
  }, {});

  const getResultIcon = (type) => {
    switch(type) {
      case 'service': return '🛠️';
      case 'message': return '✉️';
      case 'demande': return '📋';
      case 'avis': return '⭐';
      default: return '🔍';
    }
  };

  const handleResultClick = (result) => {
    if (result.type === 'service') {
      navigate(`/${user?.role}/services/${result._id}`);
    } else if (result.type === 'message') {
      navigate(`/${user?.role}/messages/${result._id}`);
    } else if (result.type === 'demande') {
      navigate(`/${user?.role}/demandes/${result._id}`);
    }
  };

  // Fonction pour afficher plus de résultats d'un type spécifique
    const showMore = (type, total) => {
    setDisplayCount(prev => ({
        ...prev,
        [type]: total
    }));
    };

    const showLess = (type) => {
    setDisplayCount(prev => ({
        ...prev,
        [type]: 5
    }));
    };

      // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy", { locale: fr });
    } catch {
      return "-";
    }
  };

  // Fonction pour traduire le type au pluriel
  const translateType = (type, count) => {
      const translations = {
      demande: (user?.role === 'technicien') ? `Intervention${count > 1 ? 's' : ''}` : `Demande${count > 1 ? 's' : ''}`,
      message: `Message${count > 1 ? 's' : ''}`,
      service: `Service${count > 1 ? 's' : ''}`,
      avis: `Avis`
    };
    return translations[type] || type;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Résultats de recherche pour "{query}"</h1>
      
      {results.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">Aucun résultat trouvé pour "{query}"</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedResults).map(([type, items]) => (
            <div key={type} className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold">
                  {translateType(type, items.length)} ({items.length})
                </h2>
              </div>
              
              <div className={(type === 'avis' && user.role === 'client') ? 'flex flex-col gap-4' : 'p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'}>
                {items.slice(0, displayCount[type]).map((result, index) => (
                    <div key={result._id} className=''>
                        {(result.type === "service" && user.role === "admin") && (
                            <ServiceCard
                                key={result._id}
                                service={result}
                                onClick={() => navigate(`/admin/services/${result._id}`)}
                            />
                        )}
                        {(result.type === "service" && user.role === "client") && (
                            <ServiceCardClient
                                key={result._id}
                                service={result}
                                onClick={() => navigate(`/client/services/${result._id}`)}
                            />
                        )}
                        {(result.type === "demande" && user.role === "admin") && (
                            <DemandesCard
                                key={result._id}
                                demande={result}
                                onClick={() => navigate(`/admin/demandes/${result._id}`)}
                            />
                        )}
                        {(result.type === "demande" && user.role === "client") && (
                            <DemandesCardClient
                                key={result._id}
                                demande={result}
                                onClick={() => navigate(`/client/demandes/${result._id}`)}
                            />
                        )}
                        {(result.type === "demande" && user.role === "technicien") && (
                            <InterventionCard
                                key={result._id}
                                intervention={result}
                                onClick={() => navigate(`/technicien/intervention`)}
                            />
                        )}
                        {(result.type === "message") && (
                            <div 
                                key={`${type}-${index}`}
                                className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                                onClick={() => handleResultClick(result)}
                            >
                                <div className="flex items-start">
                                <span className="text-2xl mr-3">{getResultIcon(type)}</span>
                                <div className="flex-1">
                                    <h3 className="font-medium text-lg">
                                    {result.nom || result.numeroDemande || result.email}
                                    </h3>
                                    <p className="text-gray-700 mt-1 line-clamp-2">
                                    {result.description || result.contenu || result.commentaire}
                                    </p>
                                    <div className="mt-2 text-sm text-gray-400">
                                    {new Date(result.createdAt || result.dateDemande).toLocaleDateString()}
                                    </div>
                                </div>
                                </div>
                            </div> 
                        )}
                        {(result.type === "avis" && user.role === "admin") && (
                            <AvisCard
                                key={result._id}
                                review={{
                                  id: result._id,
                                  image: result?.service?.image || "/image3.jpeg",
                                  service: result?.service?.nom || "Service supprimé",
                                  serviceId: result?.service?._id,
                                  date: new Date(result?.dateSoumission).toLocaleDateString('fr-FR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  }),
                                  price: result.service?.tarif ? `${result.service.tarif} XOF` : "Non spécifié",
                                  status: "Noté",
                                  category: result.service?.categorie?.nom || "Non catégorisé",
                                  note: result.note,
                                  commentaire: result.commentaire,
                                  client: result?.client || "Client anonyme",
                                  demande: result?.demande
                                }}
                                currentRating={result.note || 0}
                                maxRating={5}
                                showButton={false}
                                isAdmin={true}
                                onClick={() => navigate(`/admin/services/${result.service._id}`)}
                              />
                        )}
                        {(result.type === "avis" && user.role === "client") && (
                            <motion.div 
                                key={result._id} 
                                className="bg-white rounded-lg shadow-md p-6"
                                // variants={itemVariants}
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-4 mb-4">
                                    <div className="bg-orange-100 text-orange-600 rounded-full p-3">
                                        <FaStar className="text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                        {result?.service?.nom}
                                        </h3>
                                        <p className="text-gray-500 text-sm">
                                        Terminé le {formatDate(result?.demande?.dates?.finIntervention)}
                                        </p>
                                    </div>
                                    </div>

                                    <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className="text-xl mr-1">
                                        {i < result.note ? (
                                            <FaStar className="text-yellow-400" />
                                        ) : (
                                            <FaRegStar className="text-gray-300" />
                                        )}
                                        </span>
                                    ))}
                                    <span className="ml-2 text-gray-600">
                                        {result.note}/5
                                    </span>
                                    </div>

                                    <p className="text-gray-700 italic border-l-4 border-orange-200 pl-4 py-2 bg-gray-50 rounded">
                                    "{result.commentaire}"
                                    </p>
                                </div>

                                <div className="md:w-1/3 border-l md:pl-6 pl-3">
                                    <div className="flex items-center gap-3 mb-4">
                                    {result?.technicien?.image ? (
                                        <img 
                                        src={result?.technicien?.image?.url || `https://ui-avatars.com/api/?name=${result?.technicien?.prenom}+${result?.technicien?.nom}&background=random`} 
                                        // alt={`${result?.technicien?.prenom} ${result?.technicien?.nom}`}
                                        className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <FaUserCircle className="text-4xl text-gray-400" />
                                    )}
                                    <div>
                                        <h4 className="font-medium capitalize">
                                        {result?.technicien?.prenom && result?.technicien?.prenom.length > 8 ? `${result?.technicien?.prenom.slice(0, 1) || ""}. ` : `${result?.technicien?.prenom}`} {" "}
                                        { result?.technicien?.nom && result?.technicien?.nom.length > 7 ? `${result?.technicien?.nom.charAt(0).toUpperCase() || ""}. ` : `${result?.technicien?.nom}`}
                                        </h4>
                                        <p className="text-sm text-gray-500">Technicien</p>
                                    </div>
                                    </div>

                                    <div className="text-sm text-gray-600 space-y-2">
                                    <p>
                                        <span className="font-medium">Date d'évaluation : </span> {formatDate(result.dateSoumission)}
                                    </p>
                                    {result?.service?.tarif && (
                                        <p>
                                        <span className="font-medium">Prix : </span> {result?.service?.tarif} FCFA
                                        </p>
                                    )}
                                    <p>
                                        <span className="font-medium">Email : </span> {result?.technicien?.email}
                                    </p>
                                    </div>
                                </div>
                                </div>
                                <div className="flex justify-center mt-2">
                                    <Link
                                    to={`/${user.role}/demandes/${result?.demande?._id}`}
                                    className="block text-center text-blue-500 hover:underline"
                                    >
                                    Voir le service
                                    </Link>
                                </div>
                            </motion.div>
                        )}
                  </div>
                ))}
              </div>

            <div className="p-4 text-center border-t border-gray-100">
            {displayCount[type] < items.length ? (
                <button
                onClick={() => showMore(type, items.length)}
                className="text-orange-500 hover:text-orange-600 font-medium"
                >
                Voir tous les {translateType(type, 2).toLowerCase()} ({items.length})
                </button>
            ) : items.length > 5 && (
                <button
                onClick={() => showLess(type)}
                className="text-orange-500 hover:text-orange-600 font-medium"
                >
                Voir moins
                </button>
            )}
            </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}