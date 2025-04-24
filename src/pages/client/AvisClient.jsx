import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AvisCard from "../../components/cards/AvisCard";

const AvisClient = () => {
  const { user } = useOutletContext();
  const [reviews, setReviews] = useState([]);
  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('serviceRatings');
    return saved ? JSON.parse(saved) : {};
  });

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

  useEffect(() => {
    localStorage.setItem('serviceRatings', JSON.stringify(ratings));
  }, [ratings]);

  const handleRating = (reviewId) => {
    setRatings(prev => {
      const current = prev[reviewId] || 0;
      return current < 5 ? { ...prev, [reviewId]: current + 1 } : prev;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Avis à donner</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map(review => (
            <AvisCard
              key={review.id}
              review={review}
              currentRating={ratings[review.id] || 0}
              onRate={() => handleRating(review.id)}
              maxRating={5}
              isAdmin={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvisClient;




// import { useState, useEffect } from 'react';
// import { useOutletContext } from 'react-router-dom';
// import AvisCard from "../../components/cards/AvisCard";

// const AvisClient = () => {
//   const { user } = useOutletContext();
//   const [reviews, setReviews] = useState([]);
//   const [ratings, setRatings] = useState( () => { 
//       // Récupération des notes depuis le localStorage
//       const savedRatings = localStorage.getItem('serviceRatings');
//       return savedRatings ? JSON.parse(savedRatings) : {};
//     }
//   );
//   // Données fictives améliorées
//   const mockReviews = [
//     {
//       id: 1,
//       image: "/dev.jpg",
//       service: "Maintenance Informatique",
//       date: "Terminé le 25/02/2025",
//       price: "20.000 XOF",
//       status: "Noter",
//       category: "Informatique"
//     },
//     {
//       id: 2,
//       image: "/plomberie.jpg",
//       service: "Réparation Plomberie",
//       date: "Terminé le 26/02/2025",
//       price: "15.000 XOF",
//       status: "Noter",
//       category: "Bâtiment"
//     },
//     {
//       id: 3,
//       image: "/maintenance.jpg",
//       service: "Installation Électrique",
//       date: "Terminé le 27/02/2025",
//       price: "25.000 XOF",
//       status: "Noter",
//       category: "electricity",
//     }
//   ];

//   useEffect(() => {
//     setReviews(mockReviews);
//     // Sauvegarde des notes dans le localStorage
//     localStorage.setItem('serviceRatings', JSON.stringify(ratings));
//   }, [ratings]);

//   const handleRating = (reviewId) => {
//     setRatings(prev => {
//       const currentRating = prev[reviewId] || 0;
//       if(currentRating >= 5) return prev; // Bloque à 5 étoiles
      
//       const newRating = currentRating + 1;
//       return { 
//         ...prev, 
//         [reviewId]: newRating 
//       };
//     });
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 text-center">Avis</h1>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {reviews.map((review) => (
//             <AvisCard 
//               key={review.id} 
//               review={review} 
//               currentRating={ratings[review.id] || 0}
//               onRate={() => handleRating(review.id)}
//               maxRating={5}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AvisClient;


