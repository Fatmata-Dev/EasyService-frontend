// src/components/sections/ServicesSection.jsx
// import React, { useState, useEffect } from "react";
import ServiceCard from "../cards/ServiceCard";

const ServicesSection = () => {
  // const [services, setServices] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Données mockées (à remplacer par l'appel API)
  const services = [
    {
      id: 1,
      image: "maintenance.jpg",
      createDate: "15/03/2025",
      nom: "Maintenance Informatique",
      description: "Service complet de maintenance et dépannage informatique",
      tarif: "20 000",
    },
    {
      id: 2,
      image: "13430.jpg",
      createDate: "12/03/2025",
      nom: "Plomberie",
      description:
        "Installation et réparation de systèmes sanitaires rapidement",
      tarif: "15 000",
    },
    {
      id: 3,
      image: "Analyste de données.png",
      createDate: "22/03/2025",
      nom: "Analyste de données",
      description:
        "Installation, rénovation, et maintenance d'appareils électriques",
      tarif: "10 000",
    },
    {
      id: 4,
      image: "Développement-web.png",
      createDate: "20/03/2025",
      nom: "Developpement web",
      description:
        "Assistance et réparation de véhicules, camions, et autres matériels",
      tarif: "5 000",
    },
    // Ajoutez d'autres services...
  ];

  // useEffect(() => {
  //   const fetchServices = async () => {
  //     try {
  //       // Simule un appel API (1 seconde de délai)
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       setServices(mockServices);
  //     } catch (err) {
  //       setError("Erreur de chargement des services");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchServices();
  // }, []);

  // if (loading) return <div className="text-center py-8">Chargement des services...</div>;
  // if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div id="services">
      <h2 className="bg-[#2C3E50] text-3xl md:text-4xl font-bold text-center p-2 text-gray-100 uppercase">
        Nos Services
      </h2>

      <section className="lg:px-8 bg-white">
        <div className="mx-8">
          <h4 className="text-center pb-8 pt-4 text-lg">
            Découvrez nos services les plus demandés et connectez vous pour en
            découvrir d’avantage
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesSection;
