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
    price: "20 000 XOF",
  },
  {
    id: 2,
    image: "/13430.jpg",
    date: new Date().toLocaleDateString(),
    title: "Plomberie",
    description: "Installation et réparation de systèmes sanitaires rapidement",
    price: "15 000 XOF",
  },
  {
    id: 3,
    image: "/Analyste de données.png",
    date: new Date().toLocaleDateString(),
    title: "Analyste de données",
    description:
      "Installation, rénovation, et maintenance d'appareils électriques",
    price: "10 000 XOF",
  },
  {
    id: 4,
    image: "/Développement-web.png",
    date: new Date().toLocaleDateString(),
    title: "Developpement web",
    description:
      "Assistance et réparation de véhicules, camions, et autres matériels",
    price: "5 000 XOF",
  },
  // Ajoutez d'autres services...
];

export default function ServicesAdmin() {
    const [showModal, setShowModal] = useState(false);
  
    return (
      <div className="flex flex-col">
          <div className="rounded-tl-xl w-full">
            <div className="flex justify-between items-center mb-5">
              <h1 className="text-2xl font-bold uppercase w-fit">Services</h1>
              
              {/* Affichage du modal */}
              {showModal && (
                <ServicesModal setShowModal={setShowModal} />
              )}
  
              {/* Bouton pour afficher le modal */}
              <button
                className="px-4 py-1 text-orange-500 border-2 border-orange-500 rounded-lg flex justify-center items-center text-md hover:bg-orange-500 hover:text-white"
                onClick={() => setShowModal(true)}
              >
                <IoIosAdd className="text-3xl" />
                Ajouter un Service
              </button>
            </div>
  
            <div>
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
  