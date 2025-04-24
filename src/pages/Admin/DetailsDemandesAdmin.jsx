import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function DemandeDetails() {
  const { id } = useParams();
  const [demande, setDemande] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemande = async () => {
      try {
        const response = await axios.get(
          `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        const demandeData = response.data;

        console.log(response.data);

        // Formater les données
        const formattedDemande = {
          ...demandeData,
          service:
            typeof demandeData.service === "object"
              ? demandeData.service
              : { _id: demandeData.service, nom: "Service inconnu" },
          categorie:
            typeof demandeData.categorie === "object"
              ? demandeData.categorie?.nom
              : { _id: demandeData.categorie?.nom, nom: "Categorie inconnu" },
          client:
            typeof demandeData.client === "object"
              ? demandeData.client
              : { _id: demandeData.client, prenom: "Client", nom: "inconnu" },
          technicien:
            typeof demandeData.technicien === "object"
              ? demandeData.technicien
              : {
                  _id: demandeData.technicien,
                  prenom: "Technicien",
                  nom: "inconnu",
                },
          dateDemande: format(new Date(demandeData.dateDemande), "PPPP", {
            locale: fr,
          }),
          dateIntervention: demandeData.dateIntervention
            ? format(new Date(demandeData.dateIntervention), "PPPP", {
                locale: fr,
              })
            : "Non définie",
        };

        setDemande(formattedDemande);
      } catch (err) {
        console.error("Erreur:", err);
        setError(err.response?.data?.message || "Erreur lors du chargement");
        toast.error("Erreur lors du chargement de la demande");
      } finally {
        setLoading(false);
      }
    };

    fetchDemande();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mb-4"></div>
          <p className="text-gray-600">
            Chargement des détails de la demande...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          <h2 className="text-xl font-bold mb-4">Erreur</h2>
          <p className="mb-4">{error}</p>
          <Link
            to="/admin/demandes"
            className="text-orange-500 hover:underline"
          >
            Retour à la liste des demandes
          </Link>
        </div>
      </div>
    );
  }

  if (!demande) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Demande non trouvée</h2>
          <Link
            to="/admin/demandes"
            className="text-orange-500 hover:underline"
          >
            Retour à la liste des demandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        to="/admin/demandes"
        className="inline-block mb-4 text-orange-500 hover:underline"
      >
        &larr; Retour aux demandes
      </Link>

      <h1 className="text-2xl font-bold mb-6 text-center uppercase">
        Détails de la demande #{demande.numeroDemande}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-orange-500">
              Informations générales
            </h2>

            <div className="space-y-3">
              <p>
                <span className="font-semibold">Service:</span>{" "}
                {demande.service?.nom || "Non spécifié"}
              </p>
              <p>
                <span className="font-semibold">Statut:</span>{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    demande.statut === "En attente"
                      ? "bg-yellow-100 text-yellow-800"
                      : demande.statut === "En cours"
                      ? "bg-blue-100 text-blue-800"
                      : demande.statut === "Terminée"
                      ? "bg-green-100 text-green-800"
                      : demande.statut === "Annulée"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {demande.statut}
                </span>
              </p>
              <p>
                <span className="font-semibold">Date de demande:</span>{" "}
                {demande.dateDemande}
              </p>
              <p>
                <span className="font-semibold">Date d'intervention:</span>{" "}
                {demande.dateIntervention}
              </p>
              <p>
                <span className="font-semibold">Catégorie:</span>{" "}
                {demande.categorieService?.nom || "Non spécifiée"}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-orange-500">
              Personnes concernées
            </h2>

            <div className="space-y-3">
              <p>
                <span className="font-semibold">Client:</span>{" "}
                {demande.client?.prenom} {demande.client?.nom}
              </p>
              <p>
                <span className="font-semibold">Technicien:</span>{" "}
                {demande.technicien?.prenom || "Aucun"}{" "}
                {demande.technicien?.nom || "technicien assigné"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2 text-orange-500">
            Description
          </h2>
          <p className="bg-gray-50 p-4 rounded">
            {demande.description || "Aucune description fournie"}
          </p>
        </div>

        {demande.notes && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-2 text-orange-500">
              Notes supplémentaires
            </h2>
            <p className="bg-gray-50 p-4 rounded">{demande.notes}</p>
          </div>
        )}
      </div>

      <div className="flex justify-center">
        <Link
          to="/admin/demandes"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
        >
          Retour aux demandes
        </Link>
      </div>
    </div>
  );
}
