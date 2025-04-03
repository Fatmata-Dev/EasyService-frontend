import { useState } from "react";
import { IoIosAdd } from "react-icons/io";
import ServiceCard from "../../components/cards/ServiceCard";
import ServicesModal from "../../components/Modals/ServicesModal";

const services = [
  {
    id: 1,
    image: "/maintenance.jpg",
    date: new Date().toLocaleDateString(),
    title: "Maintenance Informatique",
    description: "Service complet de maintenance et dépannage informatique",
    tarif: "20 000 XOF",
  },
  {
    id: 2,
    image: "/13430.jpg",
    date: new Date().toLocaleDateString(),
    title: "Plomberie",
    description: "Installation et réparation de systèmes sanitaires rapidement",
    tarif: "15 000 XOF",
  },
  {
    id: 3,
    image: "/Analyste de données.png",
    date: new Date().toLocaleDateString(),
    title: "Analyste de données",
    description:
      "Installation, rénovation, et maintenance d'appareils électriques",
    tarif: "10 000 XOF",
  },
  {
    id: 4,
    image: "/Développement-web.png",
    date: new Date().toLocaleDateString(),
    title: "Developpement web",
    description:
      "Assistance et réparation de véhicules, camions, et autres matériels",
    tarif: "5 000 XOF",
  },
  // Ajoutez d'autres services...
];

export default function Services() {
    const [showModal, setShowModal] = useState(false);
  
    return (
      <div className="flex flex-col">
          <div className="">
              <h1 className="text-2xl text-center py-2 font-bold uppercase w-full">Services</h1>
              
              
  
            <div>
              <h3 className="text-lg font-bold text-orange-500 underline my-3">
                Ajout récent
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-5">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
              <h3 className="text-lg font-bold text-orange-500 underline my-3">
                Les plus demandés
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-5">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            </div>
          </div>
        </div>
    );
  }
  