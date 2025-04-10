import React, { useState } from "react";
import ReservationModal from "../Modals/ReservationModal";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AssignTechnicienModal from "../Modals/AssignerTechnicienModal";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

export default function DemandesCard({ demande, onUpdate }) {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    return format(parseISO(dateString), "dd/MM/yyyy à HH:mm", { locale: fr });
  };

  const getStatutColor = (statut) => {
    switch (statut) {
      case "en_attente":
        return "bg-yellow-500";
      case "en_cours":
        return "bg-blue-500";
      case "terminee":
        return "bg-green-500";
      case "annulee":
        return "bg-red-500";
      case "refusee":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // const handleDelete = async (id) => {
  //   if (window.confirm("Êtes-vous sûr de vouloir supprimer cette demande ?")) {
  //     try {
  //       await axios.delete(`https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //       });
  //       toast.success("Demande supprimé avec succès");
  //       navigate("/admin/demandes");
  //     } catch (err) {
  //       toast.error(
  //         err.response?.data?.message || "Erreur lors de la suppression"
  //       );
  //     }
  //   }
  // };

  const handleReject = async (id) => {
    if (window.confirm("Voulez-vous rejeter cette demande ?")) {
      try {
        await axios.put(
          `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
          { statut: "refusee" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        toast.success("Demande rejetée avec succès");
        navigate("/admin/demandes");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Erreur lors du rejet de la demande"
        );
      }
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Voulez-vous annuler cette demande ?")) {
      try {
        await axios.put(
          `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
          { statut: "annulee" },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        toast.success("Demande annulée avec succès");
        navigate("/admin/demandes");
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Erreur lors de l'annulation de la demande"
        );
      }
    }
  };

  // const handleAccept = async (id) => {
  //   try {
  //     await axios.put(
  //       `https://easyservice-backend-iv29.onrender.com/api/demandes/${id}`,
  //       { statut: "en_cours" },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //         },
  //       }
  //     );
  //     toast.success("Demande acceptée avec succès");
  //     navigate("/admin/demandes");
  //   } catch (err) {
  //     toast.error(
  //       err.response?.data?.message || "Erreur lors de l'acceptation de la demande"
  //     );
  //   }
  // };

  const handleAssignSuccess = () => {
    onUpdate && onUpdate(); // Rafraîchir la liste des demandes
  };

  return (
    <div
      key={demande._id}
      className="border border-orange-300 p-4 rounded-lg shadow-md w-full bg-orange-50 flex flex-col justify-between items-between"
    >
      <div className="flex flex-col flex-wrap">
        <h2 className="text-orange-500 font-bold text-lg mb-2 uppercase text-center">
          Informations demande
        </h2>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">N&deg; DEMANDE :</strong>{" "}
          <span>{demande.numeroDemande}</span>
        </p>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">NOM SERVICE :</strong>{" "}
          <span className="text-orange-600">{demande.service}</span>
        </p>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">DATE DEMANDE :</strong>{" "}
          <span>{formatDate(demande.date)}</span>
        </p>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">CLIENT :</strong>{" "}
          <span className="text-orange-600">
            {demande.clientPrenom} {demande.clientNom}
          </span>
        </p>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">TECHNICIEN :</strong>{" "}
          <span>{demande.technicien || "À définir"}</span>
        </p>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">DATE INTERVENTION :</strong>{" "}
          <span>{formatDate(demande.dateIntervention)}</span>
        </p>
        <p className="flex flex-wrap">
          <strong className="font-bold pe-2">STATUT :</strong>{" "}
          <span
            className={`${getStatutColor(
              demande.statut
            )} text-white px-2 py-1 rounded-full text-sm`}
          >
            {/* {demande.statut} */}
            {demande.statut === "en_attente" && "En attente"}
            {demande.statut === "en_cours" && "En cours"}
            {demande.statut === "annulee" && "Annulée"}
            {demande.statut === "refusee" && "Refusée"}
            {demande.statut === "terminee" && "Terminée"}
          </span>
        </p>
      </div>

      {/* Boutons */}
      <div className="">
        {demande.statut === "en_attente" && (
          <div className="flex flex-col">
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600"
                onClick={() => handleReject(demande._id)}
              >
                Refuser
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600"
                onClick={() => setShowAssignModal(true)}
              >
                Accepter
              </button>
            </div>
            <div className="flex justify-center">
              <Link
                to={`/admin/demandes/${demande._id}`}
                className="text-center mt-2 text-blue-500 cursor-pointer w-fit hover:underline"
              >
                Plus de détails
              </Link>
            </div>
          </div>
        )}

        {demande.statut === "en_cours" && (
          <div className="flex flex-col">
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-1.5 rounded-md hover:bg-red-600"
                onClick={() => handleCancel(demande._id)}
              >
                Annuler
              </button>
              <a
                href={`demandes/${demande._id}`}
                className="bg-orange-500 text-white px-4 py-1.5 rounded-md hover:bg-orange-600"
              >
                Détail
              </a>
            </div>
          </div>
        )}

        {(demande.statut === "annulee" ||
          demande.statut === "refusee" ||
          demande.statut === "terminee") && (
          <div className="flex flex-col">
            <div className="flex justify-center">
              <a
                href={`demandes/${demande._id}`}
                className="text-center mt-2 text-blue-500 cursor-pointer w-fit hover:underline"
              >
                Plus de détails
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {/* Modal d'assignation */}
      {showAssignModal && (
        <AssignTechnicienModal
          setShowModal={setShowAssignModal}
          demande={demande}
          onAssignSuccess={handleAssignSuccess}
        />
      )}
    </div>
  );
}
