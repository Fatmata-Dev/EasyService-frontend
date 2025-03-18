import { useState, useEffect } from 'react';
// import axios from 'axios';

const Messages = () => {
  const [messages, setMessages] = useState([]);

  // Données fictives
  const mockMessages = [
    {
      id: 1,
      sender: "Admin FADIABA",
      content: "Votre demande a été acceptée",
      date: "10/03/2025"
    },
    {
      id: 2,
      sender: "Technicien",
      content: "Intervention prévue à 14h",
      date: "11/03/2025"
    }
  ];

  useEffect(() => {
    const loadMessages = async () => {
      try {
        // À décommenter pour le backend
        // const res = await axios.get('/api/messages');
        // setMessages(res.data);
        
        setMessages(mockMessages);
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error("Erreur de chargement:", error);
      }
    };
    loadMessages();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Messages</h1>
      <div className="space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="border rounded-lg p-4 hover:bg-gray-50">
            <div className="font-semibold">{message.sender}</div>
            <p className="text-gray-600 mt-2">{message.content}</p>
            <div className="mt-2 text-sm text-gray-500">{message.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;