import React from "react";

const ServiceCard = ({ service }) => {
  return (
    <div
      className="bg-gray-300 rounded-xl
    flex flex-col h-full"
    >
      {service.image && (
        <img
          src={service.image}
          alt={service.nom || "Service image"}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = ""; // Image de remplacement
          }}
        />
      )}

      {/* Catégorie, sous-catégorie et lieu */}
      <div className="flex flex-col p-3">
        <p className=" text-orange-800 text-sm">Ajouté le {service.createDate ? new Date(service.createDate).toLocaleDateString('fr-FR') : "date inconnue"}</p>
        <h1 className="text-gray-600 text-xl font-bold line-clamp-1">
          {service.nom}
        </h1>
        <p className="text-orange-500 font-semibold mb-2">{service.categorie.nom}</p>
        <p className="line-clamp-2">{service.description}</p>

        <div className="flex justify-between flex-wrap items-center mt-4">
          <span className="text-orange-500 font-bold text-lg">
            {service.tarif} FCFA
          </span>

          <a
            href={`services/${service._id}`}
            className="bg-orange-500 text-white px-2 py-1 rounded 
                    hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Voir plus
          </a>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
