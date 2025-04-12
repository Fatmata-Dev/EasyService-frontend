import { useState, useEffect } from 'react';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

const MessagesAdmin = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('messages');
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    } catch (err) {
      setError('Erreur de chargement des messages');
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('messages', JSON.stringify(messages));
    } catch (err) {
      setError('Erreur de sauvegarde des messages');
    }
  }, [messages]);

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, {
      ...newMessage,
      date: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }]);
    setShowForm(false); // Fermer le formulaire après envoi
  };

  const handleDeleteMessage = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">Messagerie</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 text-orange-500 hover:text-orange-700 font-semibold"
        >
          <span>Nouveau message</span>
          <svg
            className={`w-4 h-4 transition-transform ${showForm ? 'rotate-45' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
      
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      {showForm && (
        <MessageForm 
          onSend={handleSendMessage} 
          onCancel={() => setShowForm(false)}
        />
      )}
      
      <MessageList 
        messages={messages} 
        onDelete={handleDeleteMessage} 
        allowDelete={true}
      />
    </div>
  );
};

export default MessagesAdmin;