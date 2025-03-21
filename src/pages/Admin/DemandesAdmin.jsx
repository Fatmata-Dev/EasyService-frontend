import { useState, useEffect } from 'react';
// import axios from 'axios';

const DemandesAdmin = () => {
  const [demands, setDemands] = useState([]);
  
  // Données fictives
  const mockDemands = [
    {
      id: 1,
      service: "Maintenance Informatique",
      date: "25/02/2025",
      status: "Terminé",
      price: "20.000 XOF"
    },
    {
      id: 2,
      service: "Plomberie",
      date: "28/02/2025",
      status: "En cours",
      price: "15.000 XOF"
    }
  ];

  useEffect(() => {
    const loadDemands = async () => {
      try {
        // À décommenter pour le backend
        // const res = await axios.get('/api/demands');
        // setDemands(res.data);
        
        setDemands(mockDemands);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    loadDemands();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mes Demandes</h1>
      <div className="space-y-4">
        {demands.map((demand) => (
          <div key={demand.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{demand.service}</h3>
                <p className="text-sm text-gray-500">{demand.date}</p>
              </div>
              <div>
                <span className={`px-2 py-1 rounded ${
                  demand.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {demand.status}
                </span>
                <p className="mt-2 text-right">{demand.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DemandesAdmin;