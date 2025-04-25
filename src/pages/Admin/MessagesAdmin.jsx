import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import MessageForm from "./MessageForm";
import MessageList from "./MessageList";

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]); // Pour la liste des utilisateurs

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy 'à' HH:mm", { locale: fr });
    } catch {
      return "-";
    }
  };

  // Récupération des messages et des utilisateurs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Récupérer les utilisateurs pour le formulaire
        const usersResponse = await axios.get("https://easyservice-backend-iv29.onrender.com/api/auth/users", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setUsers(usersResponse.data.users);

        // Récupérer les messages envoyés
        const messagesResponse = await axios.get(
          "https://easyservice-backend-iv29.onrender.com/api/messages/envoyes",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        console.log(messagesResponse.data.data);

        // Formater les messages pour une meilleure affichage
        const formattedMessages = messagesResponse.data.data.map(msg => ({
          ...msg,
          // Pour la compatibilité avec l'ancienne structure
          destinataire: msg.destinataires?.[0] || { email: "Multiple destinataires" }
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Erreur de chargement:", err);
        setError(err.response?.data?.message || "Erreur lors du chargement");
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredMessages = messages.filter((message) => {
    // Vérification sécurisée de toutes les propriétés
    const titre = message.titre || "";
    const contenu = message.contenu || "";
    const prenom = message.destinataire?.prenom || "";
    const nom = message.destinataire?.nom || "";
    const email = message.destinataire?.email || "";
  
    const searchTermLower = searchTerm.toLowerCase();
  
    return (
      titre.toLowerCase().includes(searchTermLower) ||
      contenu.toLowerCase().includes(searchTermLower) ||
      prenom.toLowerCase().includes(searchTermLower) ||
      nom.toLowerCase().includes(searchTermLower) ||
      email.toLowerCase().includes(searchTermLower)
    );
  });

  const handleSendMessage = async (newMessage) => {
    try {
      setLoading(true);
      
      // Convertir les IDs en tableau de destinataires
      const destinataires = Array.isArray(newMessage.destinataires) 
        ? newMessage.destinataires 
        : [newMessage.destinataires];

      const response = await axios.post(
        "https://easyservice-backend-iv29.onrender.com/api/messages/",
        {
          titre: newMessage.titre,
          objet: newMessage.objet || "Information",
          contenu: newMessage.contenu,
          destinataires: destinataires,
          demandeId: newMessage.demandeId || null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setMessages([response.data, ...messages]);
      toast.success("Message envoyé avec succès");
      setShowForm(false);
    } catch (err) {
      console.error("Erreur lors de l'envoi:", err);
      toast.error(err.response?.data?.message || "Erreur lors de l'envoi du message");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce message ?")) return;
    
    try {
      await axios.delete(
        `https://easyservice-backend-iv29.onrender.com/api/messages/${messageId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      setMessages(messages.filter((msg) => msg._id !== messageId));
      if (selectedMessage?._id === messageId) setSelectedMessage(null);
      toast.success("Message supprimé avec succès");
    } catch (err) {
      console.error("Erreur de suppression:", err);
      toast.error(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axios.patch(
        `https://easyservice-backend-iv29.onrender.com/api/messages/${messageId}/lu`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      
      // Mettre à jour l'état local si nécessaire
    } catch (err) {
      console.error("Erreur marquage comme lu:", err);
    }
  };

  if (loading && messages.length === 0) {
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
        {/* En-tête avec recherche et bouton nouveau message */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Messagerie Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              {messages.length} message{messages.length !== 1 ? "s" : ""} au total
            </p>
          </div>

          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Rechercher un message..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <button
              onClick={() => {
                setSelectedMessage(null);
                setShowForm(!showForm);
              }}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Nouveau</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Formulaire de nouveau message */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <MessageForm
                onSend={handleSendMessage}
                onCancel={() => setShowForm(false)}
                users={users}
                initialData={selectedMessage ? {
                  destinataires: [selectedMessage.expediteur.userId],
                  titre: `RE: ${selectedMessage.titre}`,
                  contenu: `\n\n--- Message original ---\n${selectedMessage.contenu}`
                } : null}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Interface principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des messages */}
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {filteredMessages.length === 0 ? (
                <div className="text-center p-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Aucun message trouvé</p>
                </div>
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
                    }`}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.lu) markAsRead(message._id);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center truncate">
                        <div className="bg-gray-100 w-10 h-10 rounded-full mr-3 flex items-center justify-center">
                          <span className="text-gray-500 font-semibold">
                            {message.destinataires?.[0]?.email?.charAt(0).toUpperCase() || "M"}
                          </span>
                        </div>
                        <div className="truncate">
                          <h3 className="text-gray-800 truncate">
                            {message.destinataires?.length > 1 
                              ? `${message.destinataires.length} destinataires`
                              : message.destinataires?.[0]?.email || "Destinataire inconnu"}
                          </h3>
                          <p className="text-sm text-gray-600 truncate">
                            {message.titre}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-gray-500">
                        {formatDate(message.createdAt || message.date)}
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
          <div className="lg:col-span-2">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 rounded-lg p-6 h-full"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">
                      {selectedMessage.titre}
                    </h2>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>De: {selectedMessage.expediteur?.email || "Expéditeur inconnu"}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      À: {selectedMessage.destinataires?.map(d => d.email).join(", ") || "Destinataire inconnu"}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedMessage.createdAt || selectedMessage.date)}
                  </div>
                </div>

                {selectedMessage.objet && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-sm rounded-full bg-orange-100 text-orange-800">
                      {selectedMessage.objet}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 mt-2 mb-6">
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line text-gray-800">
                      {selectedMessage.contenu}
                    </p>
                  </div>
                </div>

                {selectedMessage.demande && (
                  <div className="bg-gray-50 p-3 rounded-lg mb-4">
                    <h4 className="font-medium text-gray-700 mb-1">Lié à la demande:</h4>
                    <p className="text-sm text-gray-600">#{selectedMessage.demande.numeroDemande || selectedMessage.demande}</p>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage._id)}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>

                  <button
                    onClick={() => {
                      setShowForm(true);
                    }}
                    className="flex items-center text-orange-500 hover:text-orange-600"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                    Répondre
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8">
                <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  {messages.length === 0
                    ? "Aucun message disponible"
                    : "Sélectionnez un message"}
                </h3>
                <p className="text-gray-400 text-center">
                  {messages.length === 0
                    ? "Envoyez votre premier message à un client"
                    : "Cliquez sur un message dans la liste pour en voir le contenu"}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MessagesAdmin;