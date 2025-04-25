import { Link } from "react-router-dom";
import {
  FaLongArrowAltRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const Dashboard = () => {
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy 'à' HH:mm", { locale: fr });
    } catch {
      return "-";
    }
  };

  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);

  const userData = JSON.parse(localStorage.getItem("user"));
  const clientId = userData?.id;

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideIn = {
    hidden: { x: 50, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  // Fetch latest data
  const fetchLatestData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch latest 2 demandes
      const demandesRes = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/client/${clientId}`,
        { withCredentials: true }
      );

      // Fetch 5 services
      const servicesRes = await axios.get(
        "https://easyservice-backend-iv29.onrender.com/api/services/afficher/service",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Fetch 2 messages (ajuster selon votre API)
      const messagesRes = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/messages/recus`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Process demandes with categories
      const demandesWithCategories = await Promise.all(
        demandesRes.data.map(async (demande) => {
          if (demande?.service?.categorie) {
            const categoryRes = await axios.get(
              `https://easyservice-backend-iv29.onrender.com/api/categories/${demande.service.categorie}`,
              { withCredentials: true }
            );
            return {
              ...demande,
              service: {
                ...demande.service,
                categorie: categoryRes.data.nom || "Inconnu",
              },
            };
          }
          return demande;
        })
      );

      setDemandes(demandesWithCategories);
      setServices(servicesRes.data);
      setMessages(messagesRes.data.data || []);
    } catch (err) {
      console.error("Erreur lors du chargement des données:", err);
      setError("Erreur lors du chargement des données");
      toast.error("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    fetchLatestData();

    // Auto-slide for services
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(services.length / 3));
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchLatestData, services.length]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="flex flex-col gap-3 w-full mx-auto"
    >
      {/* Section Demandes */}
      <motion.div
        variants={slideIn}
        className="bg-white rounded-xl shadow-md p-4"
      >
        <div className="flex justify-between items-center mb-6">
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
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-gray-800">
                      {demande?.service?.nom || "Service"}
                    </h4>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        demande.statut === "En cours"
                          ? "bg-blue-100 text-blue-800"
                          : demande.statut === "En attente"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {demande.statut || "-"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {demande?.service?.categorie || "-"}
                  </p>
                  <div className="flex justify-between mt-3 text-sm">
                    <span className="text-gray-500">
                      Soumis: {formatDate(demande.dateDemande)}
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
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Derniers messages</h3>
          <Link
            to="/client/messages"
            className="text-orange-500 font-medium flex items-center gap-2 hover:underline"
          >
            Voir tous <FaLongArrowAltRight />
          </Link>
        </div>

        {messages.length === 0 ? (
          <p className="text-center text-gray-500 py-4">Aucun message récent</p>
        ) : (
          <div className="space-y-4">
            {[...messages].slice(0, 2).map((message) => (
              <div
                key={message._id}
                className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3 flex-shrink-0">
                  {message.expediteur.prenom?.charAt(0) || "A"}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-gray-800">
                      {message.expediteur.prenom || "Expéditeur"}{" "}
                      {message.expediteur.nom || ""}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(message.dateEnvoi)}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">{message.contenu}</p>
                </div>
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
        <div className="flex justify-between items-center mb-6">
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
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all">
                    <div className="h-40 bg-gray-100 rounded-md mb-3 overflow-hidden">
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
