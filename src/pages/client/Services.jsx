import { useState, useEffect } from "react";
import ServiceCardClient from "../../components/cards/ServiceCardClient";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "https://easyservice-backend-iv29.onrender.com/api/services/afficher/service",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setServices(
        response.data.map((service) => ({
          ...service,
          // Si categorie est une string (ID), vous devrez peut-être la peupler côté serveur
          categorie: service.categorie || {},
        }))
      );
    } catch (err) {
      toast.error("Erreur lors du chargement des services");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="font-bold text-2xl text-center uppercase my-3">
        Services
      </h1>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <ServiceCardClient
              key={service._id}
              service={service}
              onClick={() => navigate(`/client/services/${service._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
