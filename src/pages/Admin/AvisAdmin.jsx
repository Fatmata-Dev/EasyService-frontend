import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AvisCard from "../../components/cards/AvisCard";
// import axios from 'axios';

const AvisAdmin = () => {
  const { user } = useOutletContext();
  const [reviews, setReviews] = useState([]);

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
    // À décommenter pour le backend
    // axios.get('/api/avis')
    //   .then(res => setReviews(res.data))
    //   .catch(console.error);
    
    setReviews(mockReviews);
  }, []);

  const handleRating = (reviewId) => {
    // À décommenter pour le backend
    // axios.post(`/api/avis/${reviewId}`, { rating })
    //   .then(() => {
    //     setReviews(reviews.filter(review => review.id !== reviewId));
    //   });
    alert(`Avis enregistré pour le service ${reviewId}`);
    setReviews(reviews.filter(review => review.id !== reviewId));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-center mb-8"> {/* Modifié ici */}
          <h1 className="text-3xl font-bold text-gray-800 text-center">Avis</h1> {/* Modifié ici */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <AvisCard 
              key={review.id} 
              review={review} 
              onRate={() => handleRating(review.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvisAdmin;