import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import AvisCard from "../../components/cards/AvisCard";

const AvisAdmin = () => {
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
              showButton={false}
              isAdmin={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AvisAdmin;

