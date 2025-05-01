import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCreateAvisMutation } from '../../API/servicesApi';
import { toast } from 'react-hot-toast';

const AvisCard = ({ review, demande, currentRating, maxRating, showButton = true, isAdmin = false }) => {
  const [createAvis] = useCreateAvisMutation();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    note: review.note || "",
    commentaire: review.commentaire || "",
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const renderStars = () => {
    return Array.from({ length: maxRating }).map((_, index) => (
      <svg
        key={index}
        className={`w-6 h-6 transition-colors duration-200 ${
          index < currentRating ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        stroke={index < currentRating ? "#fbbf24" : "#6b7280"}
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
        />
      </svg>
    ));
  };

  console.log(review);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedback(prev => ({ ...prev, [name]: value }));
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.note || feedback.note < 1 || feedback.note > 5) {
      toast.error("Veuillez donner une note valide entre 1 et 5");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createAvis({
        ...feedback,
        client: review?.clientId || user._id,
        technicien: review?.technicienId,
        service: review?.serviceId,
        demande: review.demandeId
      }).unwrap();

      
      toast.success("Votre avis a été enregistré avec succès !");
      setFeedback({ note: "", commentaire: "" });
      setShowFeedbackForm(false);
    } catch (err) {
      console.error("Erreur soumission avis:", err);
      toast.error(err.data?.message || "Une erreur est survenue lors de l'envoi de votre avis");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCardClick = () => {
    if (user.role !== "client") {
      navigate(`/${user.role}/services/${review?.serviceId}`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      <div 
        className={`cursor-pointer ${user.role !== "client" ? "hover:shadow-md" : ""}`}
        onClick={handleCardClick}
      >
        <div className="absolute top-2 right-2 z-10">
          <div className="flex gap-1 bg-white/90 p-1 rounded-full shadow-sm">
            {user.role === 'admin' && renderStars()}
          </div>
        </div>

        <div className="relative h-48 overflow-hidden">
          <img
            src={review?.image}
            alt={review?.service}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.src = '/placeholder-service.jpg')}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <span className="text-white text-sm font-medium">
              {review?.category}
            </span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
              {review?.service}
            </h3>
            <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded line-clamp-1">
              {review?.date}
            </span>
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">
            {review?.description || "Service professionnel de qualité"}
          </p>

          <div className={`flex ${isAdmin ? 'justify-center' : 'justify-between'} items-center`}>
            <span className="text-xl font-bold text-gray-900">{review?.price}</span>
            {showButton && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowFeedbackForm(!showFeedbackForm);
                }}
                disabled={currentRating >= maxRating}
                className={`bg-orange-500 text-white px-4 py-1 rounded transition-colors ${
                  currentRating >= maxRating ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-600'
                }`}
              >
                {currentRating >= maxRating ? 'Déjà noté' : review?.status || 'Noter'}
              </button>
            )}
          </div>
          <div className="flex justify-center mt-2">
            <Link
              to={`/client/demandes/${review?.demandeId}`}
              className="block text-center text-blue-500 hover:underline"
            >
              Voir le service
            </Link>
          </div>
        </div>
      </div>

      {showFeedbackForm && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Donnez votre avis</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note (entre 1 et 5)
              </label>
              <div className="flex items-center gap-2 w-full">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback(prev => ({ ...prev, note: star }))}
                    className={`text-3xl ${feedback.note >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
                <input
                  type="number"
                  name="note"
                  min="1"
                  max="5"
                  value={feedback.note}
                  onChange={handleFeedbackChange}
                  className="w-12 p-2 border rounded text-center"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Commentaire
              </label>
              <textarea
                name="commentaire"
                value={feedback.commentaire}
                onChange={handleFeedbackChange}
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                rows="3"
                placeholder="Décrivez votre expérience..."
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                {isSubmitting ? 'En cours...' : 'Envoyer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

AvisCard.propTypes = {
  review: PropTypes.object.isRequired,
  currentRating: PropTypes.number.isRequired,
  maxRating: PropTypes.number,
  onRate: PropTypes.func,
  showButton: PropTypes.bool,
  isAdmin: PropTypes.bool
};

AvisCard.defaultProps = {
  maxRating: 5,
  onRate: () => {},
  showButton: true,
  isAdmin: false
};

export default AvisCard;