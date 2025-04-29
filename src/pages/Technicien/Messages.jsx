import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaEnvelope,
  FaEnvelopeOpen,
  FaUserCircle,
  FaReply,
  FaPaperclip,
  FaTrash,
} from "react-icons/fa";
import {
  useGetReceivedMessagesQuery,
  useGetSentMessagesQuery,
  useMarkAsReadMutation,
  useDeleteMessageMutation,
  useCreateMessageMutation
} from "../../API/messagesApi";

const MessagesTechniciens = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));

  // Utilisation de RTK Query
  const { 
    data: receivedMessages = [], 
    isLoading: isLoadingReceived,
    refetch: refetchReceived
  } = useGetReceivedMessagesQuery();
  
  const { 
    data: sentMessages = [], 
    isLoading: isLoadingSent,
    refetch: refetchSent
  } = useGetSentMessagesQuery();

  const [markAsRead] = useMarkAsReadMutation();
  const [deleteMessage] = useDeleteMessageMutation();
  const [createMessage] = useCreateMessageMutation();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      const date = parseISO(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy 'à' HH:mm", {
        locale: fr,
      });
    } catch {
      return "";
    }
  };

  // Combiner et trier les messages
  const allMessages = [...(receivedMessages.data || []), ...(sentMessages.data || [])]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  useEffect(() => {
    // Sélectionner le premier message non lu ou le premier message
    if (allMessages.length > 0 && !selectedMessage) {
      const unread = allMessages.find(msg => !msg.lu);
      setSelectedMessage(unread || allMessages[0]);
    }
  }, [allMessages, selectedMessage]);

  const filteredMessages = allMessages.filter(
    (message) =>
      message.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.contenu?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.expediteur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.expediteur?.nom?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMarkAsRead = async (messageId) => {
    try {
      await markAsRead(messageId).unwrap();
      refetchReceived();
    } catch (error) {
      console.error("Erreur de mise à jour:", error);
      toast.error("Erreur lors du marquage comme lu");
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      toast.error("Le message ne peut pas être vide");
      return;
    }

    if (!selectedMessage) return;

    try {
      await createMessage({
        titre: `RE: ${selectedMessage.titre}`,
        objet: selectedMessage.objet,
        contenu: replyContent,
        destinataires: [selectedMessage.expediteur.userId],
        demandeId: selectedMessage.demande?._id
      }).unwrap();

      toast.success("Réponse envoyée avec succès");
      setReplying(false);
      setReplyContent("");
      refetchSent();
    } catch (error) {
      console.error("Erreur lors de l'envoi:", error);
      toast.error(error.data?.message || "Erreur lors de l'envoi de la réponse");
    }
  };

  const handleDelete = async (messageId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    
    try {
      await deleteMessage(messageId).unwrap();
      toast.success("Message supprimé avec succès");
      
      // Mettre à jour l'état local
      if (selectedMessage?._id === messageId) {
        setSelectedMessage(null);
      }
      
      // Recharger les messages
      refetchReceived();
      refetchSent();
    } catch (error) {
      console.error("Erreur de suppression:", error);
      toast.error(error.data?.message || "Erreur lors de la suppression");
    }
  };

  if (isLoadingReceived || isLoadingSent) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaEnvelope className="mr-2 text-orange-500" />
            Mes Messages ({allMessages.filter(m => !m.lu).length} non lus)
          </h1>

          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un message..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1 border-r lg:border-r-0 lg:border-b-0 border-gray-200 pr-0 lg:pr-4">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredMessages.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  Aucun message trouvé
                </p>
              ) : (
                filteredMessages.map((message) => (
                  <motion.div
                    key={message._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    whileHover={{ scale: 1.01 }}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      message._id === selectedMessage?._id
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:bg-gray-50"
                    } ${!message.lu ? "bg-blue-50 font-semibold" : ""}`}
                    onClick={() => {
                      setSelectedMessage(message);
                      setReplying(false);
                      if (!message.lu) handleMarkAsRead(message._id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center truncate">
                        {message.expediteur?.photo ? (
                          <img
                            src={message.expediteur.photo}
                            alt={message.expediteur.prenom}
                            className="w-10 h-10 rounded-full mr-3 object-cover"
                          />
                        ) : (
                          <FaUserCircle className="w-10 h-10 text-gray-400 mr-3" />
                        )}
                        <div className="truncate">
                          <h3 className="text-gray-800 truncate">
                            {message.expediteur?.prenom || "Admin"}{" "}
                            {message.expediteur?.nom || ""}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {message.titre}
                          </p>
                        </div>
                      </div>
                      {!message.lu && (
                        <span className="bg-orange-500 w-2 h-2 rounded-full ml-2"></span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt)}
                      </span>
                      {message.objet && (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          {message.objet}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Détail du message sélectionné */}
          <div className="lg:col-span-2 pl-0 lg:pl-6">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 rounded-lg p-6 h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {selectedMessage.expediteur?.photo ? (
                      <img
                        src={selectedMessage.expediteur.photo}
                        alt={selectedMessage.expediteur.prenom}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedMessage.expediteur?.prenom || "Admin"}{" "}
                        {selectedMessage.expediteur?.nom || ""}
                      </h2>
                      <p className="text-gray-600">
                        {selectedMessage.expediteur?.email ||
                          "support@easyservice.com"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedMessage.createdAt)}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedMessage.titre}
                  </h3>
                  {selectedMessage.objet && (
                    <span className="inline-block px-2 py-1 mt-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      {selectedMessage.objet}
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-2 flex-grow">
                  <div className="prose max-w-none mb-6">
                    <p className="whitespace-pre-line text-gray-800">
                      {selectedMessage.contenu}
                    </p>
                  </div>

                  {selectedMessage.piecesJointes?.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Pièces jointes:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMessage.piecesJointes.map((piece, index) => (
                          <a
                            key={index}
                            href={piece.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
                          >
                            <FaPaperclip className="mr-2 text-gray-400" />
                            <span className="text-sm">{piece.nom}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => handleDelete(selectedMessage._id)}
                      className="flex items-center text-red-500 hover:text-red-700"
                    >
                      <FaTrash className="mr-1" />
                      Supprimer
                    </button>

                    <button
                      onClick={() => setReplying(!replying)}
                      className="flex items-center text-orange-500 hover:text-orange-600"
                    >
                      <FaReply className="mr-1" />
                      Répondre
                    </button>
                  </div>

                  <AnimatePresence>
                    {replying && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <textarea
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows="4"
                          placeholder="Votre réponse..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-2 space-x-3">
                          <button
                            onClick={() => setReplying(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleReply}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            Envoyer
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8">
                <FaEnvelopeOpen className="text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  {allMessages.length === 0
                    ? "Vous n'avez aucun message"
                    : "Cliquez sur un message dans la liste pour en voir le contenu"}
                </h3>
                <p className="text-gray-400 text-center">
                  {allMessages.length === 0
                    ? "Tous vos messages apparaîtront ici"
                    : "Sélectionnez un message pour lire son contenu et y répondre"}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessagesTechniciens;