import React, { useState, useEffect } from "react";
import ServiceCardHome from "../cards/ServiceCardHome";
import axios from "axios";
import { FaLongArrowAltRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ServicesSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(
          "https://easyservice-backend-iv29.onrender.com/api/services/afficher/service",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        // Récupérer les 8 premiers services
        const limitedServices = response.data.slice(0, 8);
        setServices(limitedServices);
      } catch (err) {
        console.error("Erreur lors du chargement des services:", err);
        setError("Erreur de chargement des services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  return (
    <div id="services">
      <h2 className="bg-[#2C3E50] text-3xl md:text-4xl font-bold text-center p-2 text-gray-100 uppercase">
        Nos Services
      </h2>

      <section className="lg:px-8 bg-white">
        <div className="mx-4">
          <h4 className="text-center pb-8 pt-4 text-lg">
            Découvrez nos services les plus demandés et connectez-vous pour en
            découvrir davantage
          </h4>
          {error && (
            <div className="text-red-500 text-center py-8">{error}</div>
          )}

          {loading ? (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {services.map((service) => (
                <ServiceCardHome key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
