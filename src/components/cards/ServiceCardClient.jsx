import React from "react";

const ServiceCardClient = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        {service.image && (
          <img
            src={service.image || "/image.png"}
            alt={service.nom || "Service image"}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = "/image.png";
            }}
          />
        )}

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white text-sm font-medium">
            {service.categorie?.nom}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2 sm:h-[50px]">
          <h3 className="text-lg font-bold text-gray-800 line-clamp-2">
            {service.nom}
          </h3>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded w-fit">
            Ajouté le{" "}
            {service.createDate
              ? new Date(service.createDate).toLocaleDateString("fr-FR")
              : "date inconnue"}
          </span>
        </div>

        <p className="text-gray-600 mb-4 line-clamp-2 sm:h-[50px]">
          {service.description || "Service professionnel de qualité"}
        </p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">
            {service.tarif} F CFA
          </span>
          <a
            href={`services/${service._id}`}
            className="hover:bg-orange-600 text-orange-500 text-center underline"
          >
            Détail
          </a>
        </div>
        <div className="flex justify-center w-full">
          <a
            href={`services/${service._id}`}
            className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded transition-colors mt-2 w-full text-center block"
          >
            Réserver
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCardClient;
