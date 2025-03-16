import React from "react";
import { Link } from "react-scroll";
import PropTypes from "prop-types";

const ServiceCard = ({ service }) => {
  return (
    <div
      className="bg-gray-300 rounded-xl
    flex flex-col h-full"
    >
      {/* Image du service */}
      {/* <div className="relative flex-1 overflow-hidden rounded-t-xl"> */}
      {/* <div className="aspect-ratio-content"> */}
      <img
        src={service.image}
        alt={service.title}
        className="w-full h-full object-cover rounded-xl"
      />
      {/* </div> */}
      {/* </div> */}

      {/* Catégorie, sous-catégorie et lieu */}
      <div className="flex flex-col p-3">
        <p className=" text-orange-800">Ajouté le {service.date}</p>
        <h1 className="text-gray-600 text-xl font-bold mb-2">
          {service.title}
        </h1>

        <p>{service.description}</p>
        <div className="flex justify-between flex-wrap items-center mt-4">
          <span className="text-orange-500 font-bold text-lg">
            {service.price}
          </span>

          <Link
            to="contact"
            smooth={true}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg 
                    hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Voir plus
          </Link>
        </div>
      </div>
    </div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    image: PropTypes.string.isRequired, // Nouvelle prop
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  }).isRequired,
};
export default ServiceCard;
