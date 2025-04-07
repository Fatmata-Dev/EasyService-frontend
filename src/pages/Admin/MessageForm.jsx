import { useState } from 'react';

const MessageForm = ({ onSend }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content) return;
    
    const newMessage = {
      author: 'Administrateur FAUMBA',
      content,
      date: new Date().toLocaleDateString('fr-FR'),
      role: 'admin'
    };
    
    onSend(newMessage);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-4 bg-white rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Nouveau message :
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded-md"
          rows="3"
          placeholder="Écrivez votre message..."
        />
      </div>
      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded"
      >
        Envoyer
      </button>
    </form>
  );
};

export default MessageForm;