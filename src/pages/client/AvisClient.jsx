import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AvisCard from "../../components/cards/AvisCard";

const AvisClient = () => {
  const { user } = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState({});
  // Données fictives améliorées
  const mockReviews = [
    {
      id: 1,
      image: "/dev.jpg",
      service: "Maintenance Informatique",
      date: "Terminé le 25/02/2025",
      price: "20.000 XOF",
      status: "Noter",
      category: "Informatique"
    },
    {
      id: 2,
      image: "/plomberie.jpg",
      service: "Réparation Plomberie",
      date: "Terminé le 26/02/2025",
      price: "15.000 XOF",
      status: "Noter",
      category: "Bâtiment"
    },
    {
      id: 3,
      image: "/maintenance.jpg",
      service: "Installation Électrique",
      date: "Terminé le 27/02/2025",
      price: "25.000 XOF",
      status: "Noter",
      category: "electricity",
    }
  ];

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  const handleRating = (reviewId) => {
    setRatings(prev => {
      const currentRating = prev[reviewId] || 0;
      const newRating = currentRating < 5 ? currentRating + 1 : 0;
      return { ...prev, [reviewId]: newRating };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center">Avis</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <AvisCard 
              key={review.id} 
              review={review} 
              currentRating={ratings[review.id] || 0}
              onRate={() => handleRating(review.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvisClient;






// // src/pages/client/Avis.jsx
// import { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// // import axios from 'axios';

// const AvisClient = () => {
//   const { user } = useOutletContext();
//   const [reviews, setReviews] = useState([]);

//   // Données fictives
//   const mockReviews = [
//     {
//       id: 1,
//       service: "Maintenance Informatique",
//       date: "25/02/2025",
//       price: "20.000 XOF",
//       status: "À noter"
//     },
//     {
//       id: 2,
//       service: "Plomberie",
//       date: "28/02/2025",
//       price: "15.000 XOF",
//       status: "À noter"
//     }
//   ];

//   useEffect(() => {
//     // À décommenter pour le backend
//     // axios.get('/api/avis')
//     //   .then(res => setReviews(res.data))
//     //   .catch(console.error);
    
//     setReviews(mockReviews);
//   }, []);

//   const handleRating = (reviewId, rating) => {
//     // À décommenter pour le backend
//     // axios.post(`/api/avis/${reviewId}`, { rating })
//     //   .then(() => update UI);
//     alert(`Note ${rating} enregistrée pour le service ${reviewId}`);
//   };

//   return (
//     <div className="bg-white rounded-lg shadow p-6">
//       <h1 className="text-2xl font-bold mb-6">Avis à donner</h1>
      
//       <div className="space-y-4">
//         {reviews.map((review) => (
//           <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h3 className="font-semibold">{review.service}</h3>
//                 <p className="text-sm text-gray-500">{review.date}</p>
//               </div>
              
//               <div className="text-right">
//                 <p className="text-blue-600 font-semibold">{review.price}</p>
//                 <div className="flex items-center gap-2 mt-2">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       onClick={() => handleRating(review.id, star)}
//                       className="text-yellow-400 hover:text-yellow-500"
//                     >
//                       ★
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AvisClient;