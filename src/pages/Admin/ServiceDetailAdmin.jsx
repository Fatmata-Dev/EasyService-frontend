import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import ServicesModal from "../../components/Modals/ServicesModal";
import {
  useGetServiceByIdQuery,
  useDeleteServiceMutation,
} from "../../services/servicesApi";

const ServiceDetailAdmin = () => {
  const { id } = useParams();
  const { data: service, isLoading, error } = useGetServiceByIdQuery(id);
  const [deleteService] = useDeleteServiceMutation();
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // État pour les commentaires
  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Admin 1",
      date: "2023-05-15",
      content: "Première intervention effectuée avec succès.",
      rating: 4,
    },
    {
      id: 2,
      author: "Client X",
      date: "2023-05-16",
      content: "Service de qualité mais un peu retardé.",
      rating: 3,
    },
  ]);

  // État pour le nouveau commentaire
  const [newComment, setNewComment] = useState({
    content: "",
    rating: 5,
  });

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

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.content.trim()) {
      toast.error("Le commentaire ne peut pas être vide");
      return;
    }

    const comment = {
      id: comments.length + 1,
      author: "Admin Actuel",
      date: new Date().toISOString().split('T')[0],
      content: newComment.content,
      rating: newComment.rating,
    };

    setComments([...comments, comment]);
    setNewComment({ content: "", rating: 5 });
    toast.success("Commentaire ajouté !");
  };

  if (isLoading)
    return <div className="text-center py-8">Chargement en cours...</div>;
  if (error)
    return (
      <div className="text-center py-8 text-red-500">Erreur de chargement</div>
    );
  if (!service)
    return <div className="text-center py-8">Service non trouvé</div>;

  return (
    <div className="container mx-auto px-4">
      <Link
        to="/admin/services"
        className="text-gray-700 px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded w-full"
      >
        Retour
      </Link>
      <h1 className="text-2xl font-bold mb-4 text-center">DÉTAIL DU SERVICE</h1>

      <div className="flex flex-col lg:flex-row md:justify-between gap-5 lg:gap-7 lg:gap-2">
        <div className="flex justify-center itemes-center w-1/2">
          <img
            src={service.image || "Image indisponible"}
            alt={service.nom || "Image indisponible"}
            className="max-w-full rounded-lg shadow-md"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "Image indisponible";
            }}
          />
        </div>

        <div className="flex flex-col gap-4 w-1/2">
          <div className="lg:w-full">
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

          <div className="lg:w-fit w-full">
            <div className="bg-orange-50 shadow-md p-6 rounded-lg border border-orange-100 w-full">
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
      </div>

      {/* Section Commentaires et Notes */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-bold mb-6">Commentaires & Notes</h2>
        
        {/* Formulaire d'ajout de commentaire */}
        {/* <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="font-semibold mb-3">Ajouter un commentaire</h3>
          <form onSubmit={handleAddComment}>
            <div className="mb-3">
              <label className="block mb-1">Note (sur 5)</label>
              <select
                value={newComment.rating}
                onChange={(e) => setNewComment({...newComment, rating: parseInt(e.target.value)})}
                className="border p-2 rounded w-full"
              >
                {[5, 4, 3, 2, 1].map((num) => (
                  <option key={num} value={num}>{num} étoile{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <textarea
                value={newComment.content}
                onChange={(e) => setNewComment({...newComment, content: e.target.value})}
                placeholder="Votre commentaire..."
                className="border p-2 rounded w-full h-24"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded"
            >
              Enregistrer
            </button>
          </form>
        </div> */}

        {/* Liste des commentaires */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500">Aucun commentaire pour ce service</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{comment.author}</h4>
                  <span className="text-sm text-gray-500">{comment.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-1 text-sm text-gray-600">({comment.rating}/5)</span>
                </div>
                <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex justify-center gap-3 lg:justify-end mt-6 sticky bottom-3">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition"
          onClick={() => setShowModal(true)}
        >
          Modifier
        </button>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded transition"
          onClick={handleDelete}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};

export default ServiceDetailAdmin;