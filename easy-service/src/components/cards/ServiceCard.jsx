import React from 'react';
import { Link } from 'react-scroll';
import PropTypes from 'prop-types';

const ServiceCard = ({ service }) => {
  return (
    <div className="bg-gray-300 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300
    flex flex-col h-full">
      {/* Image du service */}
      <div className="relative flex-1 overflow-hidden rounded-t-xl">
      {/* <div className="aspect-ratio-content"> */}
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 pb-5"
        />
        {/* </div> */}
      </div>

      {/* Catégorie, sous-catégorie et lieu */}
      <p className=" mb-3 text-orange-800">Ajouté le &nbsp;&nbsp;
        {service.date}
      </p>
      <h1 className="text-gray-600 text-xl font-bold mb-3">{service.title}</h1>

      
      <div className="flex justify-between items-center mt-4">
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
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    image: PropTypes.string.isRequired, // Nouvelle prop
    date: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    // description: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  }).isRequired
};
export default ServiceCard;