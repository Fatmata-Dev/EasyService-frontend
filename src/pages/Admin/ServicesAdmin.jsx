import { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import { toast } from "react-hot-toast";
import ServiceCard from "../../components/cards/ServiceCard";
import ServicesModal from "../../components/Modals/ServicesModal";
import { useNavigate } from "react-router-dom";
import { useGetServicesQuery } from "../../API/servicesApi";
import { motion } from "framer-motion";

export default function ServicesAdmin() {
  const { data: services = [], isLoading, error } = useGetServicesQuery();
  const [showModal, setShowModal] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const [displayedServices, setDisplayedServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(allServices.length / itemsPerPage);

  const navigate = useNavigate();
  motion;

  useEffect(() => {
    if (services && services.length > 0) {
      setAllServices(services);
      // Réinitialiser à la première page quand les données changent
      setCurrentPage(1);
    }
  }, [services]);
  
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = [...allServices].reverse().slice(startIndex, startIndex + itemsPerPage);
    setDisplayedServices(paginated);
  }, [allServices, currentPage, itemsPerPage]); // Ajouter itemsPerPage aux dépendances

  if (error) toast.error("Erreur lors du chargement des services");

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des Services</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          <IoIosAdd className="mr-2" />
          Ajouter un Service
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
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
                  <div className="bg-gray-300 w-[110px] h-[20px] animate-pulse"></div>
                  <div className="bg-orange-300 w-[110px] h-[20px] rounded animate-pulse"></div>
                </div>

                <p className="bg-gray-200 mb-4 h-[50px] animate-pulse"></p>

                <div className="flex justify-between items-center">
                  <div className="w-[120px] h-[25px] bg-gray-500 animate-pulse"></div>
                  <div className="bg-orange-500 w-[60px] h-[25px] rounded animate-pulse"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedServices.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onClick={() => navigate(`/admin/services/${service._id}`)}
            />
          ))}
        </div>
      )}

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

      {showModal && (
        <ServicesModal
          setShowModal={setShowModal}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
