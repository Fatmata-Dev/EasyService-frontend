import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const MessageList = ({ 
  messages, 
  onDelete, 
  allowDelete = false,
  onSelect,
  selectedMessageId = null 
}) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd MMM yyyy 'à' HH:mm", {
        locale: fr,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-3">
      {messages.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          Aucun message à afficher
        </div>
      ) : (
        messages.map((message) => (
          <motion.div
            key={message._id || message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-4 bg-white rounded-lg shadow relative cursor-pointer transition-all ${
              selectedMessageId === message._id ? 'ring-2 ring-orange-500' : 'hover:shadow-md'
            }`}
            onClick={() => onSelect && onSelect(message)}
          >
            {allowDelete && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(message._id || message.id);
                }}
                className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1"
                aria-label="Supprimer le message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}

            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 truncate">
                  {message.expediteur?.email || message.author || "Expéditeur inconnu"}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  À : {message.destinataires?.join(', ') || message.destinataire || "Destinataire inconnu"}
                </p>
              </div>
              <span className="text-sm text-gray-500 whitespace-nowrap ml-2">
                {formatDate(message.createdAt || message.date)}
              </span>
            </div>

            <div className="mb-2">
              <p className="font-medium text-orange-600 truncate">
                {message.titre || message.objet}
              </p>
            </div>

            {message.contenu || message.content ? (
              <div className="mt-2">
                <p className="text-gray-600 whitespace-pre-line line-clamp-2">
                  {message.contenu || message.content}
                </p>
              </div>
            ) : null}

            {message.demande && (
              <div className="mt-3 pt-2 border-t border-gray-100">
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Demande #{message.demande.numeroDemande || message.demande}
                </span>
              </div>
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

export default MessageList;