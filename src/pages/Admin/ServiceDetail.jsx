import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [requestData, setRequestData] = useState({
    date: '',
    details: ''
  });

  // Données fictives
  const mockService = {
    id: 1,
    title: "Maintenance Réseau Informatique",
    price: "10.000 FCFA/jour",
    duration: "2 heures",
    requirements: ["2 ans d'expérience", "Certification réseau"]
  };

  useEffect(() => {
    const loadService = async () => {
      try {
        // À décommenter pour le backend
        // const res = await axios.get(`/api/services/${id}`);
        // setService(res.data);
        
        setService(mockService);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    loadService();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // À décommenter pour le backend
      // await axios.post('/api/requests', { serviceId: id, ...requestData });
      alert('Demande envoyée avec succès!');
    } catch (error) {
      alert("Erreur lors de l'envoi de la demande");
    }
  };

  if (!service) return <div>Chargement...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{service.title}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Détails du Service</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Tarif:</span> {service.price}</p>
            <p><span className="font-semibold">Durée:</span> {service.duration}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Faire une Demande</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-2">Date souhaitée</label>
              <input
                type="date"
                className="border p-2 rounded w-full"
                onChange={(e) => setRequestData({...requestData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block mb-2">Détails supplémentaires</label>
              <textarea
                className="border p-2 rounded w-full h-32"
                onChange={(e) => setRequestData({...requestData, details: e.target.value})}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Soumettre la Demande
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;