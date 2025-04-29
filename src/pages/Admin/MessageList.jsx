import { useState } from "react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion } from "framer-motion";
import { 
  useGetSentMessagesQuery, 
  useGetReceivedMessagesQuery,
  useMarkAsReadMutation
} from "../../API/messagesApi";
import MessageForm from "./MessageForm";
import { FaUserCircle } from "react-icons/fa";

const MessagesList = () => {
  const [showForm, setShowForm] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user")) || {};
  
  // Utilisation des queries RTK Query avec revalidation automatique
  const { 
    data: sentMessages = [], 
    isLoading: isLoadingSent,
    error: sentMessagesError
  } = useGetSentMessagesQuery(undefined, {
    pollingInterval: 60000 // Recharge toutes les minutes
  });
  
  const { 
    data: receivedMessages = [], 
    isLoading: isLoadingReceived,
    error: receivedMessagesError
  } = useGetReceivedMessagesQuery(undefined, {
    pollingInterval: 60000
  });

  const [markAsRead] = useMarkAsReadMutation();

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM", { locale: fr });
    } catch {
      return "-";
    }
  };

  if (!localStorage.getItem('authToken')) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1>Veuillez vous connecter, votre session a expiré</h1>
      </div>
    );
  }

  if (isLoadingSent || isLoadingReceived) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (sentMessagesError || receivedMessagesError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500">
          {sentMessagesError?.data?.message || receivedMessagesError?.data?.message || 
           "Erreur lors du chargement des messages"}
        </div>
      </div>
    );
  }

  // Combiner et trier les messages par date
  const allMessages = [...(sentMessages.data || []), ...(receivedMessages.data || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Fonction pour vérifier si un message est non lu pour l'utilisateur actuel
  const isMessageUnread = (message) => {
    if (message.expediteur?.email === currentUser.email) return false;
    
    return message.destinataires?.some(
      destinataire => destinataire?.email === currentUser.email && !destinataire?.lu
    );
  };

  // Marquer un message comme lu au clic
  const handleMessageClick = async (messageId, isUnread) => {
    if (isUnread) {
      try {
        await markAsRead(messageId);
      } catch (err) {
        console.error("Erreur lors du marquage comme lu:", err);
      }
    }
  };

  return (
    <div className="sm:container sm:mx-auto sm:p-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg sm:shadow-md sm:p-6"
      >
        {/* En-tête */}
        <div className="flex justify-between items-center flex-wrap gap-2 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Messagerie Admin
          </h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Nouveau Message
          </button>
        </div>

        {/* Formulaire de nouveau message */}
        {showForm && (
          <div className="mb-6">
            <MessageForm onCancel={() => setShowForm(false)} />
          </div>
        )}

        {/* Liste des messages */}
        <div className="space-y-3">
          {allMessages.length > 0 ? (
            allMessages.map((message) => {
              const isUnread = isMessageUnread(message);
              const isSender = message.expediteur?.email === currentUser.email;
              
              return (
                <Link
                  to={`/admin/messages/${message._id}`}
                  key={message._id}
                  onClick={() => handleMessageClick(message._id, isUnread)}
                  className={`block border border-gray-200 rounded-lg p-3 sm:p-4 hover:bg-gray-50 transition-colors ${
                    isUnread ? "bg-blue-50 font-semibold" : ""
                  }`}
                >
                  <div className="flex justify-between">
                    <div className="w-full">
                      <div className="flex justify-between">
                        <h3 className="font-medium flex items-center">
                        {message?.expediteur?.photo ? (
                          <img
                            src={message?.expediteur?.photo}
                            alt={message?.expediteur?.prenom}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />) : (
                            <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                        )}
                        <div className="flex flex-col items-between">
                          <span>{isSender ? "Vous" : message.expediteur?.email}</span>
                          <span className="text-sm text-gray-600">{message?.titre}</span>
                        </div>
                        </h3>
                        <span className="text-sm text-gray-500">
                          {formatDate(message.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-1">
                        {message.contenu}
                      </p>
                    </div>
                    {isUnread && (
                      <span className="bg-orange-500 w-2 h-2 rounded-full ml-2 mt-1"></span>
                    )}
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">
              Aucun message trouvé
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default MessagesList;