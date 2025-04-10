import React, { useState, useEffect } from "react";
import ServiceCard from "../cards/ServiceCard";
import axios from "axios";
import { FaLongArrowAltRight } from "react-icons/fa";

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

  if (loading)
    return <div className="text-center py-8">Chargement des services...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;

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

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {services.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
