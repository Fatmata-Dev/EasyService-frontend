import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function AssignTechnicienModal({
  setShowModal,
  demande,
  onAssignSuccess,
}) {
  const [techniciens, setTechniciens] = useState([]);
  const [selectedTechnicien, setSelectedTechnicien] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
  };

  // Charger la liste des techniciens disponibles
  useEffect(() => {
    const fetchTechniciens = async () => {
      try {
        const response = await axios.get(
          "https://easyservice-backend-iv29.onrender.com/api/auth/all/techniciens",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (Array.isArray(response.data.techniciens)) {
          response.data.techniciens.map((technicien) => {
            // Vérifier si le technicien a un ID valide
            if (!technicien._id) {
              console.error("Technicien sans ID:", technicien);
            }
            // Filtrer les techniciens valides
            const validTechniciens = response.data.techniciens.filter(
              (tech) => tech._id && tech.prenom && tech.nom && tech.disponible
            );

            setTechniciens(validTechniciens);
            console.log(technicien);
          });
        } else {
          //console.log(response.data.techniciens);
          setError("Format de données inattendu");
          toast.error("Erreur: les techniciens n'ont pas pu être chargés");
        }
      } catch (err) {
        setError(err.message);
        toast.error("Erreur lors du chargement des techniciens");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTechniciens();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log("Données à envoyer:", {
      demandeId: demande._id,
      technicienId: selectedTechnicien,
    });

    if (!selectedTechnicien) {
      toast.error("Veuillez sélectionner un technicien");
      setIsLoading(false);
      return;
    }

    //const demandeId = demande._id;

    try {
      const response = await axios.post(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/assigner`,
        {
          demandeId: demande._id,
          technicienId: selectedTechnicien,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log(response);

      toast.success("Technicien assigné avec succès");
      onAssignSuccess(); // Rafraîchir la liste des demandes
      setShowModal(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Erreur lors de l'assignation du technicien"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 min-w-[200px] w-[800px] m-5 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="uppercase border-b-2 border-dashed w-full mb-2 font-bold text-xl text-orange-500 text-center">
          Assigner un technicien
        </h3>

        <form onSubmit={handleSubmit}>
          {/* Section informations de la demande (lecture seule) */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-700 mb-2">
              Informations de la demande
            </h4>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  N° Demande
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {demande.numeroDemande}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Service
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {demande.service}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Client
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {demande.clientPrenom} {demande.clientNom}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Statut
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded capitalize">
                  {demande.statut.replace("_", " ")}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-500">
                Description
              </label>
              <div className="mt-1 p-2 bg-gray-100 rounded min-h-[60px]">
                {demande.description || "Aucune description"}
              </div>
            </div>
          </div>

          {/* Section assignation technicien (modifiable) */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-700 mb-2">Assignation</h4>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technicien *
                </label>
                {isLoading ? (
                  <div>Chargement des techniciens...</div>
                ) : error ? (
                  <div className="text-red-500">{error}</div>
                ) : (
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedTechnicien}
                    onChange={(e) => setSelectedTechnicien(e.target.value)}
                    required
                    disabled={isLoading || error}
                  >
                    <option value="">Sélectionnez un technicien</option>
                    {techniciens.length > 0 ? (
                      techniciens.map((tech) => (
                        <option key={tech._id} value={tech._id}>
                          {tech.prenom} {tech.nom} - {tech.metier}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Aucun technicien disponible
                      </option>
                    )}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date d'intervention
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {formatDate(demande.dateIntervention)}
                </div>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? "Enregistrement..." : "Assigner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
