import { useState, useEffect } from 'react';
// import axios from 'axios';

const Services = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Données fictives
  const mockServices = [
    {
      id: 1,
      title: "Maintenance Réseau",
      price: "10.000 FCFA/jour",
      duration: "2 heures",
      category: "Informatique"
    },
    {
      id: 2,
      title: "Réparation Plomberie",
      price: "15.000 FCFA/jour",
      duration: "3 heures",
      category: "Bâtiment"
    }
  ];

  useEffect(() => {
    const loadServices = async () => {
      try {
        // À décommenter pour le backend
        // const res = await axios.get(`/api/services?search=${searchTerm}`);
        // setServices(res.data);
        
        setServices(mockServices);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    loadServices();
  }, [searchTerm]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Services Disponibles</h1>
      <input
        type="text"
        placeholder="Rechercher un service..."
        className="border p-2 rounded w-full mb-4"
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.id} className="border rounded-lg p-4 hover:shadow-md">
            <h3 className="font-bold text-lg">{service.title}</h3>
            <div className="mt-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {service.category}
              </span>
            </div>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-blue-600 font-semibold">{service.price}</span>
              <span className="text-sm text-gray-500">{service.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;