import { useState, useEffect } from "react";
import ServiceCardClient from "../../components/cards/ServiceCardClient";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Services() {
  const [services, setServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allServices.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await axios.get(
          "https://easyservice-backend-iv29.onrender.com/api/services/afficher/service",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const formattedServices = data.map((service) => ({
          ...service,
          categorie: service.categorie || {},
        }));

        setServices(formattedServices);
        setAllServices(formattedServices);
      } catch (err) {
        toast.error("Erreur lors du chargement des services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    if (allServices && allServices.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const paginated = [...allServices]
        .reverse()
        .slice(startIndex, startIndex + itemsPerPage);
      setDisplayedServices(paginated);
    }
  }, [allServices, currentPage, itemsPerPage]);

  return (
    <div className="container mx-auto xl:px-4">
      <h1 className="font-bold text-2xl text-center uppercase my-3">
        Services
      </h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="h-[192px] bg-gray-200 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="bg-gray-50 w-[120px] h-[20px] animate-pulse"></div>
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2 sm:h-[50px]">
                  <div className="bg-gray-300 w-[80px] h-[20px] animate-pulse"></div>
                  <div className="bg-orange-300 w-[80px] h-[20px] rounded animate-pulse"></div>
                </div>
                <p className="bg-gray-200 mb-4 h-[50px] animate-pulse"></p>
                <div className="flex justify-center items-center">
                  <div className="bg-orange-400 w-full h-[25px] rounded animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-3 xl:gap-5">
            {displayedServices.map((service) => (
              <ServiceCardClient
                key={service._id}
                service={service}
                onClick={() => navigate(`/client/services/${service._id}`)}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="inline-flex rounded-md shadow">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-l-md border ${
                    currentPage === 1
                      ? "bg-gray-200 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Précédent
                </button>

                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`px-3 py-1 border ${
                      currentPage === index + 1
                        ? "bg-orange-500 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-r-md border ${
                    currentPage === totalPages
                      ? "bg-gray-200 cursor-not-allowed"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Suivant
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}
