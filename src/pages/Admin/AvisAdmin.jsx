// src/pages/client/Avis.jsx
import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
// import axios from 'axios';

const AvisAdmin = () => {
  const { user } = useOutletContext();
  const [reviews, setReviews] = useState([]);

  // Données fictives
  const mockReviews = [
    {
      id: 1,
      service: "Maintenance Informatique",
      date: "25/02/2025",
      price: "20.000 XOF",
      status: "À noter"
    },
    {
      id: 2,
      service: "Plomberie",
      date: "28/02/2025",
      price: "15.000 XOF",
      status: "À noter"
    }
  ];

  useEffect(() => {
    // À décommenter pour le backend
    // axios.get('/api/avis')
    //   .then(res => setReviews(res.data))
    //   .catch(console.error);
    
    setReviews(mockReviews);
  }, []);

  const handleRating = (reviewId, rating) => {
    // À décommenter pour le backend
    // axios.post(`/api/avis/${reviewId}`, { rating })
    //   .then(() => update UI);
    alert(`Note ${rating} enregistrée pour le service ${reviewId}`);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-6">Avis à donner</h1>
      
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{review.service}</h3>
                <p className="text-sm text-gray-500">{review.date}</p>
              </div>
              
              <div className="text-right">
                <p className="text-blue-600 font-semibold">{review.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRating(review.id, star)}
                      className="text-yellow-400 hover:text-yellow-500"
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvisAdmin;