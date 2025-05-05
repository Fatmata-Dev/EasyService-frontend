import { useState } from 'react';
import { useGetAvisQuery, useGetServicesQuery } from '../../API/servicesApi';
import AvisCard from "../../components/cards/AvisCard";
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AvisAdmin = () => {
  const { data: reviews, isLoading, isError, error } = useGetAvisQuery();
  const { data: services } = useGetServicesQuery();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const navigate = useNavigate();
  // console.log(reviews);

  if (isError) {
    toast.error(error?.data?.message || "Erreur lors du chargement des avis");
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto text-center py-10">
          <p className="text-red-500">Erreur lors du chargement des avis</p>
        </div>
      </div>
    );
  }

  // Créer un map des services pour un accès rapide
  const servicesMap = services?.reduce((acc, service) => {
    acc[service._id] = service;
    return acc;
  }, {});

  // Fusionner les avis avec les données du service
  const enrichedReviews = reviews?.map(review => {
    const service = servicesMap?.[review.service._id];
    return {
      ...review,
      service: service || null
    };
  });

  // Extraire les catégories uniques pour le filtre
  const categories = ['Tous', ...new Set(
    enrichedReviews?.map(review => 
      review.service?.categorie?.nom || 'Non catégorisé'
    ).filter(Boolean)
  )];

  // Filtrer les avis par catégorie sélectionnée
  const filteredReviews = selectedCategory === 'Tous' 
    ? enrichedReviews 
    : enrichedReviews?.filter(review => 
        review.service?.categorie?.nom === selectedCategory || 
        (selectedCategory === 'Non catégorisé' && !review.service?.categorie)
      );

      // console.log(filteredReviews)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Tous les avis</h1>
          
          {/* Filtre par catégorie */}
          <div className="flex items-center gap-2">
            <label htmlFor="category-filter" className="font-medium text-gray-700">
              Filtrer par catégorie:
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <div className="h-40 w-full rounded-md mb-4 bg-gray-200 animate-pulse"></div>
                <div className="h-6 w-3/4 mb-2 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-1/2 mb-2 bg-gray-200 animate-pulse"></div>
                <div className="h-4 w-full mb-4 bg-gray-200 animate-pulse"></div>
                <div className="flex justify-between">
                  <div className="h-8 w-20 bg-gray-200 animate-pulse"></div>
                  <div className="h-8 w-24 bg-gray-200 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            {filteredReviews?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...filteredReviews].reverse().map((review) => (
                  console.log(review),
                  <AvisCard
                    key={review._id}
                    review={{
                      id: review._id,
                      image: review?.service?.image || "/image3.jpeg",
                      service: review?.service?.nom || "Service supprimé",
                      serviceId: review?.service?._id,
                      date: new Date(review?.dateSoumission).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      }),
                      price: review.service?.tarif ? `${review.service.tarif} XOF` : "Non spécifié",
                      status: "Noté",
                      category: review.service?.categorie?.nom || "Non catégorisé",
                      note: review.note,
                      commentaire: review.commentaire,
                      client: review?.client || "Client anonyme",
                      demande: review?.demande
                    }}
                    currentRating={review.note || 0}
                    maxRating={5}
                    showButton={false}
                    isAdmin={true}
                    onClick={() => navigate(`/admin/services/${review.service._id}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Aucun avis trouvé {selectedCategory !== 'Tous' ? `pour la catégorie ${selectedCategory}` : ''}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AvisAdmin;