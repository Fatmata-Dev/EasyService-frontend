import { IoIosAdd } from "react-icons/io";
import { useState } from "react";
import DemandesModal from "../../components/Modals/DemandesModal";

export default function DemandesAdmin() {
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
      status: "En cours",
    },
    {
      id: 3,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "Terminé",
    },
    {
      id: 4,
      service: "Installation Serveur",
      date: "15-04-2025",
      client: "Awa Diop",
      status: "Annulé",
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
      status: "Refusé",
    },
  ];

  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("En attente");

  const filteredDemandes = demandes.filter(
    (demande) => demande.status === activeTab
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "En attente":
        return "bg-yellow-500";
      case "En cours":
        return "bg-blue-500";
      case "Terminé":
        return "bg-green-500";
      case "Annulé":
        return "bg-red-500";
      case "Refusé":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAccept = (id) => {
    console.log(`Demande ${id} acceptée`);
    // Ajoutez votre logique ici
  };

  return (
    <div className="">
      <h1 className="text-2xl font-bold uppercase w-full text-center pb-3">
        Services
      </h1>

      {/* Bouton pour ouvrir la modale */}
      <div className="flex justify-end mb-4">
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded flex items-center"
          onClick={() => setShowModal(true)}
        >
          <IoIosAdd className="mr-2" /> Ajouter une demande
        </button>
      </div>

      {/* Affichage du modal */}
      {showModal && <DemandesModal setShowModal={setShowModal} />}

      {/* Onglets */}
      <div className="flex justify-center mb-6 w-full">
        <button
          className={`py-2 w-full ${
            activeTab === "En attente"
              ? "bg-orange-500 text-white"
              : "border border-gray-400"
          }`}
          onClick={() => setActiveTab("En attente")}
        >
          En attente
        </button>
        <button
          className={`py-2 w-full ${
            activeTab === "En cours"
              ? "bg-orange-500 text-white"
              : "border border-gray-400"
          }`}
          onClick={() => setActiveTab("En cours")}
        >
          En cours
        </button>
        <button
          className={`py-2 w-full ${
            activeTab === "Annulé"
              ? "bg-orange-500 text-white"
              : "border border-gray-400"
          }`}
          onClick={() => setActiveTab("Annulé")}
        >
          Annulés
        </button>
        <button
          className={`py-2 w-full ${
            activeTab === "Refusé"
              ? "bg-orange-500 text-white"
              : "border border-gray-400"
          }`}
          onClick={() => setActiveTab("Refusé")}
        >
          Refusés
        </button>
        <button
          className={`py-2 w-full ${
            activeTab === "Terminé"
              ? "bg-orange-500 text-white"
              : "border border-gray-400"
          }`}
          onClick={() => setActiveTab("Terminé")}
        >
          Terminés
        </button>
      </div>

      {/* Liste des demandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {filteredDemandes.map((demande) => (
          <div
            key={demande.id}
            className="border border-orange-300 p-4 rounded-lg shadow-md w-full bg-orange-50"
          >
            <h2 className="text-orange-500 font-bold text-lg mb-2">
              INFORMATION DE LA DEMANDE
            </h2>
            <p>
              <strong>ID DEMANDE :</strong> {demande.id}
            </p>
            <p>
              <strong>NOM SERVICE :</strong>{" "}
              <span className="text-orange-600">{demande.service}</span>
            </p>
            <p>
              <strong>DATE DEMANDE :</strong> {demande.date}
            </p>
            <p>
              <strong>CLIENT :</strong>{" "}
              <span className="text-orange-600">{demande.client}</span>
            </p>
            <p>
              <strong>TECHNICIEN :</strong>
            </p>
            <p>
              <strong>DATE INTERVENTION :</strong>
            </p>
            <p>
              <strong>STATUS :</strong>{" "}
              <span
                className={`${getStatusColor(
                  demande.status
                )} text-white px-2 py-1 rounded-full text-sm`}
              >
                {demande.status}
              </span>
            </p>

            {/* Boutons */}
            <div className="flex justify-between mt-4">
              <p className="mt-2 text-blue-500 cursor-pointer">
                Plus de détails
              </p>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={() => handleAccept(demande.id)}
              >
                Accepter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
