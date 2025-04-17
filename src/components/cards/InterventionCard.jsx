import { useState } from "react";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function InterventionCard({ intervention, onStatutChange }) {
  const [showDetails, setShowDetails] = useState(false);
  const [note, setNote] = useState(intervention.note || "");
  const [commentaire, setCommentaire] = useState(intervention.commentaire || "");

  const formatDate = (dateString) => {
      return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
    };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implémentez la logique de soumission ici
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-orange-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white"
    >
      <h3 className="text-lg font-bold text-center mb-3 text-orange-600">
        {intervention.service}
      </h3>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">Client:</span> {intervention.client}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {formatDate(intervention.dateIntervention)}
        </p>
        <p>
          <span className="font-semibold">Heure:</span> {intervention.heureDebut} - {intervention.heureFin}
        </p>
        <p>
          <span className="font-semibold">Statut:</span>{" "}
          <span
            className={`inline-block px-2 py-1 text-xs rounded ${
              intervention.statut === "en_cours"
                ? "bg-yellow-100 text-yellow-800"
                : intervention.statut === "terminee"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {intervention.statut}
          </span>
        </p>
      </div>

      <button
        onClick={() => setShowDetails(!showDetails)}
        className="mt-3 text-blue-500 text-sm hover:underline"
      >
        {showDetails ? "Masquer les détails" : "Voir les détails"}
      </button>

      {showDetails && (
        <div className="mt-4 pt-4 border-t">
          <p className="mb-2">
            <span className="font-semibold">Adresse:</span> {intervention.adresse}
          </p>
          <p className="mb-3">
            <span className="font-semibold">Description:</span> {intervention.description}
          </p>

          {intervention.statut === "en_cours" && (
            <div className="flex space-x-2 mt-4">
              <button
                onClick={() => onStatutChange(intervention._id, "terminee")}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                Terminer
              </button>
              <button
                onClick={() => onStatutChange(intervention._id, "annulee")}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                Annuler
              </button>
            </div>
          )}

          {intervention.statut === "terminee" && !intervention.note && (
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Note (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">
                  Commentaire
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows="3"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
              >
                Soumettre l'évaluation
              </button>
            </form>
          )}
        </div>
      )}
    </motion.div>
  );
}