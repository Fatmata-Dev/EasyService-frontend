import React from 'react';
import PropTypes from 'prop-types';

const AvisCard = ({ review, onRate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden">
        <img
          src={review.image}
          alt={review.service}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/placeholder-service.jpg';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <span className="text-white text-sm font-medium">
            {review.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{review.service}</h3>
          <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
            {review.date}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{review.description || "Service professionnel de qualité"}</p>

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">{review.price}</span>
          <button
            onClick={onRate}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {review.status}
          </button>
        </div>
      </div>
    </div>
  );
};

AvisCard.propTypes = {
  review: PropTypes.shape({
    id: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    service: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  onRate: PropTypes.func.isRequired
};

export default AvisCard;