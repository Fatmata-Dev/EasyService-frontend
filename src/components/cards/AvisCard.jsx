import React from 'react';
import PropTypes from 'prop-types';

const AvisCard = ({ review, currentRating, onRate }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* Étoiles en haut à droite */}
      <div className="absolute top-2 right-2 z-10">
        <div className="flex gap-1 bg-white/90 p-1 rounded-full">
          {[...Array(5)].map((_, index) => (
            <svg
              key={index}
              className="w-6 h-6"
              fill={index < currentRating ? "#fbbf24" : "none"}
              stroke="#000"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          ))}
        </div>
      </div>

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
  currentRating: PropTypes.number.isRequired,
  onRate: PropTypes.func.isRequired
};

export default AvisCard;





// import React from 'react';
// import PropTypes from 'prop-types';

// const AvisCard = ({ review, currentRating, onRate }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//       <div className="relative h-48 overflow-hidden">
//         <img
//           src={review.image}
//           alt={review.service}
//           className="w-full h-full object-cover"
//           onError={(e) => {
//             e.target.src = '/placeholder-service.jpg';
//           }}
//         />
//         <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
//           <span className="text-white text-sm font-medium">
//             {review.category}
//           </span>
//         </div>
//       </div>

//       <div className="p-4">
//         <div className="flex justify-between items-start mb-2">
//           <h3 className="text-lg font-bold text-gray-800">{review.service}</h3>
//           <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
//             {review.date}
//           </span>
//         </div>

//         <p className="text-gray-600 mb-4">{review.description || "Service professionnel de qualité"}</p>

//         <div className="flex justify-between items-center">
//           <span className="text-xl font-bold text-gray-900">{review.price}</span>
//           <button
//             onClick={onRate}
//             className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
//           >
//             {review.status}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// AvisCard.propTypes = {
//   review: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     image: PropTypes.string.isRequired,
//     service: PropTypes.string.isRequired,
//     date: PropTypes.string.isRequired,
//     price: PropTypes.string.isRequired,
//     status: PropTypes.string.isRequired,
//     category: PropTypes.string.isRequired,
//     description: PropTypes.string
//   }).isRequired,
//   onRate: PropTypes.func.isRequired
// };

// export default AvisCard;