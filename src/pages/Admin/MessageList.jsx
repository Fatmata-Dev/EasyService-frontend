import { motion } from 'framer-motion';

const MessageList = ({ messages, onDelete, allowDelete }) => {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-4 bg-white rounded-lg shadow relative"
        >
          {allowDelete && (
            <button 
              onClick={() => onDelete(index)}
              className="absolute top-3 right-2 text-red-500 hover:text-red-700" 
            >
              ✕
            </button>
          )}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-gray-800">{message.author}</h3>
              <p className="text-sm text-gray-500">Pour : {message.destinataire}</p>
            </div>
            <span className="text-sm text-gray-500 mr-6">{message.date}</span>
          </div>
          <div className="mb-2">
            <p className="font-medium text-blue-600">Objet : {message.objet}</p>
          </div>
          {/* Ajout de l'affichage du contenu */}
          <div className="mt-2">
            <p className="text-gray-600 whitespace-pre-wrap">
              {message.content}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MessageList;
