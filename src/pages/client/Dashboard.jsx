import { Link } from "react-router-dom";
import {
  FaLongArrowAltRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useGetDemandeForClientIdQuery } from "../../API/demandesApi";
import { useGetCategoriesQuery, useGetServicesQuery } from "../../API/servicesApi";
import { useGetReceivedMessagesQuery } from "../../API/messagesApi";
// import { useGetUserByIdQuery } from "../../API/authApi";
import { useAuth } from "../../context/useAuth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy", { locale: fr });
    } catch {
      return "-";
    }
  };
  const navigate = useNavigate();

  const [currentSlide, setCurrentSlide] = useState(0);
  const { user } = useAuth();
  const clientId = user?._id;
  // console.log(clientId);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideIn = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Fetch data using RTK Query
  const {
    data: demandes = [],
    isLoading: isLoadingDemandes,
    isError: isErrorDemandes,
    error: demandesError
  } = useGetDemandeForClientIdQuery(clientId, { skip: !clientId });

  const {
    data: services = [],
    isLoading: isLoadingServices,
    isError: isErrorServices,
    error: servicesError
  } = useGetServicesQuery();

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    isError: isErrorMessages,
    error: messagesError
  } = useGetReceivedMessagesQuery();

  const { data: categories = [] } = useGetCategoriesQuery();

  // console.log(categories)

  const getCategorieNom = (categorieId) => {
    return categories.find(cat => cat._id === categorieId)?.nom || "-";
  };
  
  // Fetch sender info for each message
  const messages = messagesData?.data || [];
  // const messageSenders = messages.map(message => message.expediteur?.userId).filter(Boolean);
  
  // Fetch all senders data at once
  // const { data: sendersData } = useGetUserByIdQuery(messageSenders, {
  //   skip: messageSenders.length === 0,
  //   selectFromResult: ({ data }) => ({
  //     data: data?.reduce((acc, user) => {
  //       acc[user._id] = user;
  //       return acc;
  //     }, {})
  //   })
  // });

  // Process messages with sender info
  const processedMessages = messages.map(message => {
    // const senderId = message.expediteur?.userId;
    // const sender = senderId ? sendersData?.[senderId] : null;
    // console.log(message);
    const isUnread = message.destinataires?.some(
      destinataire => destinataire?.email === user.email && !destinataire?.lu
    );

    // console.log(isUnread);
    
    return {
      ...message,
      unreaded: isUnread,
      // expediteur: {
      //   prenom: sender?.prenom || "Expéditeur",
      //   nom: sender?.nom || ""
      // }
    };
  });
  // console.log(processedMessages);

  // Auto-slide for services
  useEffect(() => {
    if (services.length > 3) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % Math.ceil(services.length / 3));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [services.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(services.length / 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(services.length / 3)) %
        Math.ceil(services.length / 3)
    );
  };

  // Handle loading and error states
  const isLoading = isLoadingDemandes || isLoadingServices || isLoadingMessages;
  const error = isErrorDemandes ? demandesError : 
                isErrorServices ? servicesError : 
                isErrorMessages ? messagesError : null;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    toast.error("Erreur lors du chargement des données");
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Erreur lors du chargement des données</p>
      </div>
    );
  }

  return (
    <motion.div
      // initial="hidden"
      // animate="visible"
      variants={fadeIn}
      className="flex flex-col gap-3 w-full mx-auto"
    >
      
      <h1 className="text-2xl font-bold">Tableau de Bord</h1>
      {/* Section Demandes */}
      <motion.div
        variants={slideIn}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-1">
          <h3 className="text-xl font-bold text-gray-800">
            Vos dernières demandes
          </h3>
          <Link
            to="/client/demandes"
            className="text-orange-500 font-medium flex items-center gap-2 hover:underline"
          >
            Voir toutes <FaLongArrowAltRight />
          </Link>
        </div>

        {demandes.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Aucune demande récente
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {[...demandes]
              .reverse()
              .slice(0, 2)
              .map((demande) => (
                <div
                  key={demande._id}
                  className={`border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow p-2 sm:p-4 hover:bg-gray-100 cursor-pointer`}
                  onClick={() => navigate(`/client/demandes/${demande._id}`)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-800">
                      {demande?.service?.nom || "Service"}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full font-semibold text-xs ${
                        demande.statut === "en_attente"
                      ? "bg-yellow-100 text-yellow-800"
                      : demande.statut === "acceptee"
                      ? "bg-indigo-100 text-indigo-800"
                      : demande.statut === "en_cours"
                      ? "bg-blue-100 text-blue-800"
                      : demande.statut === "terminee"
                      ? "bg-green-100 text-green-800"
                      : demande.statut === "annulee"
                      ? "bg-red-100 text-red-800"
                      : demande.statut === "refusee"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {demande.statut === "en_attente" ? "En attente" : "" }
                      {demande.statut === "acceptee" ? "Acceptée" : ""}
                      {demande.statut === "en_cours" ? "En cours" : ""}
                      {demande.statut === "terminee" ? "Terminée" : ""}
                      {demande.statut === "annulee" ? "Annulee" : ""}
                      {demande.statut === "refusee" ? "Refusée" : ""}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {getCategorieNom(demande?.service?.categorie) || "-"}
                  </p>
                  <div className="flex justify-between mt-3 text-sm flex-wrap gap-1">
                    <span className="text-gray-500">
                      Soumis : {formatDate(demande.dateDemande)}
                    </span>
                    <span className="font-medium text-orange-500">
                      {demande.tarif || "-"} FCFA
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </motion.div>

      {/* Section Messages */}
      <motion.div
        variants={slideIn}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
          <h3 className="text-xl font-bold text-gray-800">Derniers messages</h3>
          <Link
            to="/client/messages"
            className="text-orange-500 font-medium flex items-center gap-2 hover:underline"
          >
            Voir tous <FaLongArrowAltRight />
          </Link>
        </div>

        {processedMessages.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Aucun message récent</p>
        ) : (
          <div className="space-y-4">
            {[...processedMessages].slice(0, 2).map((message) => (
              <div 
                key={message._id} className={`flex gap-2 border rounded-lg p-2 sm:p-4 hover:bg-gray-100 cursor-pointer ${
                message.unreaded ? "border-l-4 border-blue-500 bg-blue-50" : ""
                }`} onClick={() => navigate(`/client/messages/${message._id}`)}
                >
                <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                  {message.expediteur.email?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start flex-wrap gap-1">
                    <h4 className="font-semibold text-gray-800">
                      {message.expediteur.email || "Expéditeur"}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-start">
                      {message.objet && (
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {message.objet}
                        </span>
                      )}
                  </div>
                  <p className="text-gray-600 mt-1 line-clamp-2">{message.contenu}</p>
                </div>
                {message.unreaded && (
                  <span className="bg-orange-500 w-2 h-2 rounded-full ml-2 mt-1"></span>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Section Services */}
      <motion.div
        variants={slideIn}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="flex justify-between items-center mb-6 flex-wrap gap-1">
          <h3 className="text-xl font-bold text-gray-800">Services récents</h3>
          <Link
            to="/client/services"
            className="text-orange-500 font-medium flex items-center gap-2 hover:underline"
          >
            Voir tous <FaLongArrowAltRight />
          </Link>
        </div>

        {services.length === 0 ? (
          <p className="text-center text-gray-500 py-4">
            Aucun service disponible
          </p>
        ) : (
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {[...services].reverse().map((service) => (
                <div
                  key={service._id}
                  className="flex-shrink-0 w-full md:w-1/3 px-2"
                >
                  <div className="border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                    <div className="h-40 bg-gray-100 rounded-t-md mb-3 overflow-hidden">
                      {service.image ? (
                        <img
                          src={service.image}
                          alt={service.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Pas d'image
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-semibold text-gray-800">
                        {service.nom}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1 truncate">
                        {service.description}
                      </p>
                      <div className="flex justify-between items-center mt-3">
                        <span className="font-medium text-orange-500">
                          {service.tarif} FCFA
                        </span>
                        <Link
                          to={`/client/services/${service._id}`}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Voir détails
                        </Link>
                      </div>
                      </div>
                  </div>
                </div>
              ))}
            </div>

            {services.length > 3 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  onClick={prevSlide}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaChevronLeft className="text-gray-600" />
                </button>
                <button
                  onClick={nextSlide}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  <FaChevronRight className="text-gray-600" />
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;