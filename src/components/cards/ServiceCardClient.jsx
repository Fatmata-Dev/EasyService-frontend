import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReservationModal from "../Modals/ReservationModal";

const ServiceCardClient = ({ service }) => {
  const [showModal, setShowModal] = useState(false);

  // console.log(service);

  // Vérification que le service existe et a la bonne structure
  if (!service || typeof service !== 'object') {
    return <div className="bg-white rounded-xl shadow-md p-4">Service non disponible</div>;
  }

  const handleReservationClick = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  // service = new Array(service);
  // console.log(service);
  // service.map((service) => 
  
  // );

  // Assurez-vous que les propriétés existent avant de les utiliser
  const serviceImage = service.image || "/image.png";
  const serviceName = service.nom || "Nom de service inconnu";
  const serviceDescription = service.description || "Service professionnel de qualité";
  const servicePrice = service.tarif ? `${service.tarif} F CFA` : "Prix non disponible";
  const categoryName = service.categorie?.nom || "Catégorie inconnue";
  const createDate = service.createDate 
    ? new Date(service.createDate).toLocaleDateString("fr-FR")
    : "date inconnue";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={serviceImage}
          alt={serviceName}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "/image.png";
          }}
        />

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white text-sm font-medium">
            {categoryName}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2 sm:h-[50px]">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {serviceName}
          </h3>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded w-fit">
            Ajouté le {createDate}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2 sm:h-[50px]">
          {serviceDescription}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">
            {servicePrice}
          </span>
          <Link
            to={`/client/services/${service._id}`}
            className="hover:font-semibold text-orange-500 text-center underline"
          >
            Détails
          </Link>
        </div>
        <div className="flex justify-center w-full">
          <button
            onClick={handleReservationClick}
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-colors mt-2 w-full text-center block"
          >
            Réserver
          </button>
        </div>
      </div>
      
      {showModal && (
        <ReservationModal
          setShowModal={setShowModal}
          selectedService={{
            ...service,
            categorie: service.categorie?._id || service.categorie,
          }}
          serviceId={service._id}
        />
      )}
    </div>
  );
};

export default ServiceCardClient;