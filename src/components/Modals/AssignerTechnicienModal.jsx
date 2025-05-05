import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useGetTechniciensQuery } from "../../API/authApi";
import { useAssignerDemandeMutation } from "../../API/demandesApi";
import { useAuth } from "../../context/useAuth";

export default function AssignTechnicienModal({
  setShowModal,
  demande,
}) {
  const [selectedTechnicien, setSelectedTechnicien] = useState("");
  const { user } = useAuth();
  const adminId = user;
  

  // Récupération des techniciens via RTK Query
  const { 
    data: techniciensData, 
    isLoading: isLoadingTechniciens, 
    error: techniciensError ,
    refetch
  } = useGetTechniciensQuery();

  console.log(techniciensData);

  // Mutation pour l'assignation
  const [assignerDemande, { isLoading: isAssigning }] = useAssignerDemandeMutation();

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
  };

  // Filtrage des techniciens disponibles
  const techniciensDisponibles = techniciensData?.filter(tech => 
    tech._id && tech.prenom && tech.nom && tech.disponible
  ) || [];

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedTechnicien) {
      toast.error("Veuillez sélectionner un technicien");
      return;
    }

    // console.log(demande);

    try {
      await assignerDemande({
        demandeId: demande._id,
        technicienId: selectedTechnicien,
        adminId: adminId._id
      }).unwrap();

      toast.success("Technicien assigné avec succès");
      setShowModal(false);
    } catch (err) {
      toast.error(
        err.data?.message || "Erreur lors de l'assignation du technicien"
      );
      console.log(err);
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
          {/* Section informations de la demande */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-700 mb-2">
              Informations de la demande
            </h4>

            <div className="flex flex-col sm:flex-row mb-4 gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">
                  N° Demande
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {demande.numeroDemande}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">
                  Service
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {demande.service.nom}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row mb-4 gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-500">
                  Client
                </label>
                <div className="mt-1 p-2 bg-gray-100 rounded">
                  {demande.client.prenom} {demande.client.nom}
                </div>
              </div>
              <div className="flex-1">
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

          {/* Section assignation technicien */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-700 mb-2">Assignation</h4>

            <div className="flex flex-col sm:flex-row mb-4 gap-5">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technicien *
                </label>
                {isLoadingTechniciens ? (
                  <div>Chargement des techniciens...</div>
                ) : techniciensError ? (
                  <div className="text-red-500">
                    Erreur lors du chargement des techniciens
                  </div>
                ) : (
                  <select
                    className="w-full p-2 border border-gray-300 rounded"
                    value={selectedTechnicien}
                    onChange={(e) => setSelectedTechnicien(e.target.value)}
                    required
                    disabled={isLoadingTechniciens || techniciensError}
                  >
                    <option value="">Sélectionnez un technicien</option>
                    {techniciensDisponibles.length > 0 ? (
                      techniciensDisponibles.map((tech) => (
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

              <div className="flex-1">
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
              disabled={isLoadingTechniciens || isAssigning}
            >
              {isAssigning ? "Enregistrement..." : "Assigner"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}