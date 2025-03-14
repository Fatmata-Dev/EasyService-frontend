// src/components/sections/ServicesSection.jsx
import React, { useState, useEffect } from 'react';
import ServiceCard from '../cards/ServiceCard';

const ServicesSection = () => {
  // const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);

  // Données mockées (à remplacer par l'appel API)
  const services = [
    {
      id: 1,
      image: "maintenance.jpg",
      date: new Date().toLocaleDateString(),
      title: "Maintenance Informatique",
      // description: "Service complet de maintenance et dépannage informatique",
      price: "20 000 XOF"
    },
    {
      id: 2,
      image: "plomberie.jpg",
      date: new Date().toLocaleDateString(),
      title: "Plomberie",
      // description: "Installation et réparation de systèmes sanitaires",
      price: "15 000 XOF"
    },
    {
      id: 3,
      image: "Analyste de données.png",
      date: new Date().toLocaleDateString(),
      title: "Analyste de données",
      // description: "Installation, rénovation, et maintenance d'appareils électriques",
      price: "10 000 XOF"
    },
    {
      id: 4,
      image: "Développement-web.png",
      date: new Date().toLocaleDateString(),
      title: "Developpement web",
      // description: "Assistance et réparation de véhicules, camions, et autres matériels",
      price: "5 000 XOF"
    }
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
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="bg-[#2C3E50] text-3xl md:text-4xl font-bold text-center p-2 mb-12 text-gray-100">
          Nos Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map(service => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;