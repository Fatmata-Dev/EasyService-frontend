import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import { 
  useDeleteMessageMutation, 
  useGetMessageByIdQuery, 
  useMarkAsReadMutation 
} from "../../API/messagesApi";
import { useGetDemandeByIdQuery } from "../../API/demandesApi";
import toast from "react-hot-toast";
import MessageForm from "../Admin/MessageForm";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/useAuth";

const DetailsMessageTechnicien = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  
  // Récupération des données avec RTK Query
  const { data: message, isLoading, error } = useGetMessageByIdQuery(id);
  const [markAsRead] = useMarkAsReadMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  
  // Récupération de la demande associée si elle existe
  const { data: demande } = useGetDemandeByIdQuery(message?.demande, {
    skip: !message?.demande
  });

  const { user } = useAuth();
  const currentUser = user || {};
  const currentUserEmail = currentUser.email;

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = parseISO(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy 'à' HH:mm", { 
        locale: fr 
      });
    } catch {
      return "-";
    }
  };

  // Marquer comme lu quand le composant est monté
  useEffect(() => {
    if (!message || !currentUserEmail) return;

    const destinataire = message.destinataires?.find(
      d => d?.email === currentUserEmail && !d?.lu
    );

    if (destinataire) {
      markAsRead(id);
    }
  }, [id, message, currentUserEmail, markAsRead]);

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    
    try {
      await deleteMessage(messageId).unwrap();
      toast.success("Message supprimé avec succès");
      navigate("/technicien/messages");
    } catch (err) {
      console.error("Erreur de suppression:", err);
      toast.error(err.data?.message || "Erreur lors de la suppression");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          {error.data?.message || "Erreur lors du chargement du message"}
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Message non trouvé</div>
      </div>
    );
  }

  // Vérifie les rôles et permissions
  const isSender = message?.expediteur?.email === currentUserEmail;
  const isRecipient = message.destinataires?.some(
    d => d?.email === currentUserEmail
  );
  const isAdmin = currentUser.role === 'admin';

  if (!isAdmin && !isSender && !isRecipient) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">Vous n'avez pas accès à ce message</div>
      </div>
    );
  }

  // Formater les destinataires pour l'affichage
  const formatDestinataires = () => {
    return message.destinataires
      ?.map(d => 
        d?.email === currentUserEmail ? "Vous" : d?.email
      )
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="sm:container sm:mx-auto sm:p-4 max-w-6xl">
      <div className="bg-white rounded-lg shadow-md sm:p-6 p-2">
        <Link 
          to="/technicien/messages" 
          className="inline-block mb-4 text-orange-500 hover:underline"
        >
          &larr; Retour aux messages
        </Link>
        
        <div className="mb-6">
          
          <div className="flex flex-col gap-2 justify-between mt-2">
            <div className="flex items-start justify-between w-full flex-wrap gap-2">
                <div className="flex items-center">
              {message.expediteur?.photo ? (
                <img
                  src={message.expediteur.photo}
                  alt={message.expediteur.prenom}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
              )}
              
              <div className="flex flex-col justify-between">
                <p className="text-md font-bold text-gray-800 line-clamp-2">De : {isSender ? `Vous` : message?.expediteur?.email}</p>
                <p className="text-gray-600">À : {formatDestinataires()}</p>
              </div>
              </div>
                <p className="text-sm text-gray-500">{formatDate(message?.createdAt)}</p>
            </div>
            
          <h1 className="text-2xl font-bold">{message?.titre}</h1>
            
          </div>
          
          {message?.demande && demande && (
            <div className="bg-gray-100 p-3 rounded-lg mb-4">
              <h4 className="font-medium text-gray-700 mb-1">Lié à la demande :</h4>
              <div className="flex items-center gap-1 flex-wrap">
                <Link 
                  to={`/technicien/demandes/${demande._id}`} 
                  className="text-sm text-gray-600 hover:underline w-fit"
                >
                  #{demande.numeroDemande || message?.demande}
                </Link>
                <span className="block text-xs text-gray-500 w-fit">
                  (Cliquez sur le numéro pour voir la demande)
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200 pt-4 mt-2 flex-grow">
            <div className="prose max-w-none mb-6">
                <p className="whitespace-pre-line">{message?.contenu}</p>
            </div>
        </div>


        <div className="border-t border-gray-200 pt-4 flex justify-between">
          <button
            onClick={() => handleDeleteMessage(message._id)}
            className="text-red-500 hover:text-red-700 flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Supprimer
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center text-orange-500 hover:text-orange-600"
            disabled={!isRecipient && !isAdmin}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Répondre
          </button>
        </div>
      </div>

      {showForm && (
        <MessageForm 
          onCancel={() => setShowForm(false)} 
          initialData={{
            objet: `Re: ${message.titre}`,
            destinataires: [message.expediteur.email],
            demandeId: message.demande
          }}
        />
      )}
    </div>
  );
};

export default DetailsMessageTechnicien