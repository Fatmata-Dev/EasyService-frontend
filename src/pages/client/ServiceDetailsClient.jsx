import { useParams, Link } from "react-router-dom";
import { 
  useGetServiceByIdQuery, 
  useGetAvisQuery 
} from "../../API/servicesApi";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FaEdit, FaTrash, FaStar, FaRegStar, FaArrowLeft } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useGetUserByIdQuery } from "../../API/authApi";
import React, { useState } from "react";
import ReservationModal from "../../components/Modals/ReservationModal";

const ServiceDetailAdmin = () => {
  const { id } = useParams();
  const [showModal, setShowModal] = useState(false);
  
  // RTK Query hooks
  const { 
    data: service, 
    isLoading, 
    error,
    refetch
  } = useGetServiceByIdQuery(id);
  
  const { 
    data: feedbacks, 
    isLoading: isLoadingFeedbacks 
  } = useGetAvisQuery();

  // Filtrer les avis pour ce service
  const serviceFeedbacks = feedbacks?.filter(
    feedback => feedback.service._id === id
  ) || [];

  const clientInfos = serviceFeedbacks?.find(
    feedback => feedback?.client?._id
  ) || [];

  const { data: user } = useGetUserByIdQuery(clientInfos?.client?._id, { skip: !clientInfos?.client?._id });

  const formatDate = (dateString) => {
    if (!dateString) return "Date non spécifiée";
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy", { locale: fr });
    } catch {
      return "Date invalide";
    }
  };

  const handleReservationClick = () => {
    setShowModal(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error.data?.message || "Erreur de chargement du service"}
      </div>
    );
  }

  if (!service) {
    return <div className="text-center py-8">Service non trouvé</div>;
  }

  return (
    <div className="sm:container sm:mx-auto sm:px-4 sm:py-6">
      <Link
        to="/client/services"
        className="inline-flex items-center text-orange-500 hover:text-orange-700 mb-6"
      >
        <FaArrowLeft className="mr-2" />
        Retour à la liste
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
        DÉTAILS DU SERVICE
      </h1>

      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        {/* Image du service */}
        <div className="lg:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-64 lg:h-80 rounded-lg overflow-hidden shadow-lg">
            <img
              src={service.image || "/mecano.jpg"}
              alt={service.nom}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "/mecano.jpg";
              }}
            />
          </div>
        </div>

        {/* Détails du service */}
        <div className="lg:w-1/2 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-orange-600">
              {service.nom?.toUpperCase()}
            </h2>
            {service.categorie && (
              <span className="inline-block bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm mt-1">
                {service.categorie.nom}
              </span>
            )}
          </div>

          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-line">
              {service.description || "Aucune description disponible"}
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 shadow-sm">
            <ul className="space-y-2">
              <li className="flex gap-2 flex-wrap">
                <span className="font-semibold">Tarif :</span>
                <span>{service.tarif ? `${service.tarif} FCFA` : "Non spécifié"}</span>
              </li>
              <li className="flex gap-2 flex-wrap">
                <span className="font-semibold">Durée :</span>
                <span>
                  {service.duree 
                    ? `${service.duree} ${service.uniteDuree || ''}` 
                    : "Non spécifiée"}
                </span>
              </li>
              <li className="flex gap-2 flex-wrap">
                <span className="font-semibold">Date intervention :</span>
                <span>{formatDate(service.dateIntervention)}</span>
              </li>
              {service.createDate && (
                <li className="pt-2 mt-2 border-t border-orange-100 text-sm text-gray-600">
                  Ajouté le {format(new Date(service.createDate), "dd/MM/yyyy")} par{" "}
                  <span className="font-medium text-orange-600 capitalize">
                    {service.admin?.prenom} {service.admin?.nom}
                  </span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Section Avis */}
      <div className="mt-8 pt-6 border-t">
        <h2 className="text-xl font-bold mb-4">Avis des clients</h2>
        
        {isLoadingFeedbacks ? (
          <p>Chargement des avis...</p>
        ) : serviceFeedbacks.length === 0 ? (
          <p className="text-gray-500 italic">Aucun avis pour ce service</p>
        ) : (
          <div className="space-y-4">
            {serviceFeedbacks.map((feedback) => (
              <div key={feedback._id} className="bg-white p-4 rounded-lg shadow-sm border">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex justify-between items-center w-full flex-wrap gap-2">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <img 
                        src={feedback.client?.image?.url || `https://ui-avatars.com/api/?name=${feedback?.client?.prenom}+${feedback?.client?.nom}&background=random`}
                        alt="Signature professionnelle"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <span className="capitalize">{user?.prenom || ""} {" "}{user?.nom || "Client anonyme"}</span>
                      
                    </h4>
                    <span className="text-sm text-gray-500">
                      {formatDate(feedback.dateSoumission)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    star <= feedback.note ? (
                      <FaStar key={star} className="text-yellow-400" />
                    ) : (
                      <FaRegStar key={star} className="text-gray-300" />
                    )
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    ({feedback.note}/5)
                  </span>
                </div>
                {feedback.commentaire && (
                  <p className="text-gray-700 whitespace-pre-line">
                    {feedback.commentaire}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bouton d'action */}
      <div className="flex justify-end">
          <div className="w-full">
            <button
              className="fixed bottom-5 right-5 bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 text-sm font-medium w-fit flex items-center gap-2"
              onClick={() => handleReservationClick()}
            >
              <FiCalendar />
              Réserver
            </button>
          </div>
      </div>

      {showModal && (
        <ReservationModal
        setShowModal={setShowModal}
        selectedService={{
          ...service,
          categorie: service.categorie?._id || service.categorie,
        }}
        serviceId={service._id}
        refresh={refetch}
        />
      )}
    </div>
  );
};

export default ServiceDetailAdmin;