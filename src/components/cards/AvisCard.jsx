import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';
import { useCreateAvisMutation } from '../../API/servicesApi';
import { toast } from 'react-hot-toast';
import { FiArrowRight, FiCalendar, FiCheckCircle, FiClock, FiEdit3, FiFileText, FiMessageSquare, FiStar, FiThumbsUp, FiUser, FiX } from 'react-icons/fi';

const AvisCard = ({ review, currentRating, maxRating = 5, showButton = true, isAdmin = false }) => {
  const [createAvis] = useCreateAvisMutation();
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({
    note: review.note || "",
    commentaire: review.commentaire || "",
  });
  

  // console.log(review);

  const { user } = useAuth();
  const navigate = useNavigate();

  const renderStars = (rating) => {
    return Array.from({ length: maxRating }).map((_, index) => (
      <FiStar
        key={index}
        size={18}
        className={`${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

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
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200">
      {/* Header with image */}
      <div 
        className="relative h-48 overflow-hidden group cursor-pointer"
        onClick={handleCardClick}
      >
        <img
          src={review?.image || '/placeholder-service.jpg'}
          alt={review?.service}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent p-4 flex flex-col justify-end">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-white text-sm font-medium bg-blue-500 px-2 py-1 rounded-full inline-flex items-center">
                <FiFileText size={14} className="mr-1" />
                {review?.category}
              </span>
            </div>
            
          </div>
        </div>
      </div>

      {/* Card body */}
      <div className="px-5 py-2">
        
      <h3 className="text-xl font-bold line-clamp-1 mb-1">
                {review?.service}
              </h3>
        {/* Rating and date */}
        <div className="flex justify-between items-center flex-wrap gap-2 mb-3">
          <div className="flex items-center">
            {renderStars(currentRating)}
            <span className="ml-2 text-sm text-gray-500">{currentRating}/{maxRating}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <FiCalendar size={14} className="mr-1" />
            {review?.date}
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
        {isAdmin && (
              <div className="flex items-center bg-gray-200 px-2 py-1 rounded-full w-fit">
                <FiUser size={14} className="text-gray-600 mr-1" />
                <span className="text-xs font-medium text-gray-700">
                  {review?.client?.prenom || "Anonyme"} {" "}
                  {review?.client?.nom || ""}
                </span>
              </div>
            )}
          <div className="flex items-start bg-gray-100 px-3 py-2 mt-2 rounded-lg">
            <FiMessageSquare size={18} className="text-gray-400 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-gray-600 line-clamp-2">
              {review?.commentaire || review?.description || "Aucun commentaire"}
            </p>
          </div>
        </div>

        {/* Price and action button */}
        <div className="flex justify-between items-center border-t border-gray-100 pt-2">
          <div className="flex justify-between flex-wrap gap-2 items-center w-full">
            <span className="text-xl font-bold text-gray-900">{review?.price}</span>
            <Link
            to={`/client/demandes/${review?.demande?._id}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
          >
            Voir les détails <FiArrowRight size={14} className="ml-1" />
          </Link>
          </div>
          
          {showButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowFeedbackForm(!showFeedbackForm);
              }}
              disabled={currentRating >= maxRating}
              className={`flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                currentRating >= maxRating 
                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed' 
                  : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
              }`}
            >
              {currentRating >= maxRating ? (
                <>
                  <FiCheckCircle size={16} className="mr-1" />
                  Déjà noté
                </>
              ) : (
                <>
                  <FiEdit3 size={16} className="mr-1" />
                  {review?.status || 'Noter'}
                </>
              )}
            </button>
          )}
        </div>

        
      </div>

      {/* Feedback form */}
      {showFeedbackForm && (
        <div className="p-5 border-t border-gray-100 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiMessageSquare size={18} className="mr-2 text-orange-500" />
              Donnez votre avis
            </h3>
            <button 
              onClick={() => setShowFeedbackForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={18} />
            </button>
          </div>
          
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre note
              </label>
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedback(prev => ({ ...prev, note: star }))}
                      className={`p-1 rounded-full ${
                        feedback.note >= star 
                          ? 'bg-yellow-100 text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      <FiStar size={20} className={feedback.note >= star ? 'fill-current' : ''} />
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  name="note"
                  min="1"
                  max="5"
                  value={feedback.note}
                  onChange={handleFeedbackChange}
                  className="w-14 px-2 py-1 border border-gray-300 rounded text-center text-sm"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Votre commentaire
              </label>
              <textarea
                name="commentaire"
                value={feedback.commentaire}
                onChange={handleFeedbackChange}
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                rows="3"
                placeholder="Décrivez votre expérience..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowFeedbackForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center"
              >
                <FiX size={16} className="mr-1" />
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <FiClock size={16} className="mr-1 animate-spin" />
                    Envoi...
                  </>
                ) : (
                  <>
                    <FiThumbsUp size={16} className="mr-1" />
                    Envoyer
                  </>
                )}
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
  showButton: PropTypes.bool,
  isAdmin: PropTypes.bool
};

export default AvisCard;