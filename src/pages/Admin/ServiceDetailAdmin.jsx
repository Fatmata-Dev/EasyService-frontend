import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import ServicesModal from '../../components/Modals/ServicesModal';
import { 
  useGetServiceByIdQuery,
  useDeleteServiceMutation 
} from '../../services/servicesApi';

const ServiceDetailAdmin = () => {
  const { id } = useParams();
  const { data: service, isLoading, error } = useGetServiceByIdQuery(id);
  const [deleteService] = useDeleteServiceMutation();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    if (!dateString) return "Date non spécifiée";
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service ?")) {
      try {
        await deleteService(id).unwrap();
        toast.success("Service supprimé avec succès");
        navigate("/admin/services");
      } catch (err) {
        toast.error(err.data?.message || "Erreur lors de la suppression");
      }
    }
  };

  if (isLoading) return <div className="text-center py-8">Chargement en cours...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Erreur de chargement</div>;
  if (!service) return <div className="text-center py-8">Service non trouvé</div>;

  return (
    <div className="container mx-auto px-4">
      <Link
        to="/admin/services"
        className="text-gray-700 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
      >
        Retour
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">DÉTAIL DU SERVICE</h1>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center">
          <img
            src={service.image || "Image indisponible"}
            alt={service.nom || "Image indisponible"}
            className="max-w-full sm:max-w-lg rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "Image indisponible";
            }}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <h2 className="text-xl font-bold mb-2 text-orange-500">
              {service.nom?.toUpperCase()}
            </h2>
            <p className="text-gray-700 mb-4 font-semibold">
              {service.categorie?.nom || "Catégorie non spécifiée"}
            </p>

            <p className="text-gray-700 whitespace-pre-line">
              {service.description || "Aucune description disponible"}
            </p>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-orange-50 shadow-md p-6 rounded-lg border border-orange-100">
              <p className="mb-3">
                <strong>TARIF :</strong>{" "}
                {service.tarif ? `${service.tarif} FCFA` : "Non spécifié"}
              </p>
              <p className="mb-3">
                <strong>DUREE :</strong>{" "}
                {service.duree
                  ? `${service.duree} ${service.uniteDuree || ""}`
                  : "Non spécifiée"}
              </p>
              <p className="mb-3">
                <strong>DATE INTERVENTION :</strong>{" "}
                {formatDate(service.dateIntervention)}
              </p>
              <p className="text-sm text-gray-600 mt-4">
                Ajouté le{" "}
                {service.createDate
                  ? new Date(service.createDate).toLocaleDateString("fr-FR")
                  : "date inconnue"}{" "}
                par l'admin{" "}
                <strong className="text-orange-500 uppercase">
                  {service.admin?.prenom} {service.admin?.nom}
                </strong>
              </p>
            </div>
          </div>
        </div>

        {showModal && (
          <ServicesModal
            setShowModal={setShowModal}
            selectedService={service}
            isEditing={true}
          />
        )}

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md transition"
            onClick={() => setShowModal(true)}
          >
            Modifier
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md transition"
            onClick={handleDelete}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailAdmin;