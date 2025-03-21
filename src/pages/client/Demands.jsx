export default function Demands() {
  const demandes = [
    {
      id: 1,
      service: "Maintenance Réseaux",
      date: "10-03-2025",
      client: "Mouhamed Ndiaye",
      status: "En attente",
    },
    {
      id: 2,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "En attente",
    },
    {
      id: 3,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "En attente",
    },
    {
      id: 4,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "En attente",
    },
    {
      id: 5,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "En attente",
    },
    {
      id: 6,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "En attente",
    }
  ];

  return (
    <div className="p-6">
      {/* Onglets */}
      <div className="flex justify-center mb-6 w-full">
        <button className="bg-orange-500 text-white py-2 w-full">En attente</button>
        <button className="border border-gray-400 py-2 w-full">En cours</button>
        <button className="border border-gray-400 py-2 w-full">Annulés</button>
        <button className="border border-gray-400 py-2 w-full">Refusés</button>
        <button className="border border-gray-400 py-2 w-full">Terminés</button>
      </div>

      {/* Liste des demandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {demandes.map((demande) => (
          <div key={demande.id} className="border border-orange-300 p-4 rounded-lg shadow-md w-full bg-orange-50">
            <h2 className="text-orange-500 font-bold text-lg mb-2">INFORMATION DE LA DEMANDE</h2>
            <p><strong>ID DEMANDE :</strong> {demande.id}</p>
            <p><strong>NOM SERVICE :</strong> <span className="text-orange-600">{demande.service}</span></p>
            <p><strong>DATE DEMANDE :</strong> {demande.date}</p>
            <p><strong>CLIENT :</strong> <span className="text-orange-600">{demande.client}</span></p>
            <p><strong>TECHNICIEN :</strong></p>
            <p><strong>DATE INTERVENTION :</strong></p>
            <p><strong>STATUS :</strong> <span className="text-orange-600">{demande.status}</span></p>

            {/* Boutons */}
            <div className="flex justify-between mt-4">
              <button className="bg-red-500 text-white px-4 py-2 rounded-md">Refuser</button>
              <button className="bg-orange-500 text-white px-4 py-2 rounded-md">Accepter</button>
            </div>

            {/* Lien détails */}
            <p className="text-center mt-2 text-blue-500 cursor-pointer">Plus de détails</p>
          </div>
        ))}
      </div>
    </div>
  );
}
