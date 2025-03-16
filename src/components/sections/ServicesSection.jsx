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
      date: new Date().toLocaleDateString(),
      title: "Maintenance Informatique",
      description: "Service complet de maintenance et dépannage informatique",
      price: "20 000 XOF",
    },
    {
      id: 2,
      image: "13430.jpg",
      date: new Date().toLocaleDateString(),
      title: "Plomberie",
      description: "Installation et réparation de systèmes sanitaires rapidement",
      price: "15 000 XOF",
    },
    {
      id: 3,
      image: "Analyste de données.png",
      date: new Date().toLocaleDateString(),
      title: "Analyste de données",
      description:
        "Installation, rénovation, et maintenance d'appareils électriques",
      price: "10 000 XOF",
    },
    {
      id: 4,
      image: "Développement-web.png",
      date: new Date().toLocaleDateString(),
      title: "Developpement web",
      description:
        "Assistance et réparation de véhicules, camions, et autres matériels",
      price: "5 000 XOF",
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

      <section className="lg:p-12 bg-white">
        <div className="mx-auto mx-16 sm:mx-8 md:mx-12 lg:px-4">
          <h4 className="text-center pb-8 pt-2">Découvrez nos services les plus demandés et connectez vous pour en découvrir d’avantage</h4>
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
