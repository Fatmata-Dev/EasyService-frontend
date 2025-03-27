import { useState, useEffect } from 'react';
import MessageForm from './MessageForm';
import MessageList from './MessageList';

const MessagesAdmin = ({ userRole }) => {
  const [messages, setMessages] = useState([]);

  // Charger les messages depuis le localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('messages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  // Sauvegarder les messages dans le localStorage
  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  const handleSendMessage = (newMessage) => {
    setMessages([...messages, newMessage]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Messages</h1>
      
      {userRole === 'admin' && (
        <MessageForm onSend={handleSendMessage} />
      )}

      <MessageList messages={messages} />
    </div>
  );
};

export default MessagesAdmin;