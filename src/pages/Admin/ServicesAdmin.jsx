import { useState, useEffect } from "react";
import { IoIosAdd } from "react-icons/io";
import axios from "axios";
import { toast } from "react-hot-toast";
import ServiceCard from "../../components/cards/ServiceCard";
import ServicesModal from "../../components/Modals/ServicesModal";
import { useNavigate } from "react-router-dom";

export default function ServicesAdmin() {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await axios.get("https://easyservice-backend-iv29.onrender.com/api/services/afficher/service", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      
      setServices(response.data.map(service => ({
        ...service,
        // Si categorie est une string (ID), vous devrez peut-être la peupler côté serveur
        categorie: service.categorie || {}
      })));
    } catch (err) {
      toast.error("Erreur lors du chargement des services");
      console.log(err)
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleServiceCreated = (newService) => {
    setServices(prev => [...prev, newService]);
    setShowModal(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
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

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map(service => (
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
          onSuccess={handleServiceCreated}
        />
      )}
    </div>
  );
}