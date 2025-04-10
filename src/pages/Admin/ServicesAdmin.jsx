
import { useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { toast } from 'react-hot-toast';
import ServiceCard from '../../components/cards/ServiceCard';
import ServicesModal from '../../components/Modals/ServicesModal';
import { useNavigate } from 'react-router-dom';
import { useGetServicesQuery } from '../../services/servicesApi';

export default function ServicesAdmin() {
  const { data: services = [], isLoading, error } = useGetServicesQuery();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  if (error) toast.error('Erreur lors du chargement des services');

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Gestion des Services</h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          <IoIosAdd className="mr-2" />
          Ajouter un Service
        </button>
      </div>

      {isLoading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              onClick={() => navigate(`/admin/services/${service._id}`)}
            />
          ))}
        </div>
      )}

      {showModal && (
        <ServicesModal
          setShowModal={setShowModal}
          onSuccess={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
