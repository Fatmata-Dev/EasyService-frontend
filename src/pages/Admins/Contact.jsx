import { useState } from 'react';
// import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    subject: '',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // À décommenter pour le backend
      // await axios.post('/api/contact', formData);
      alert('Message envoyé avec succès!');
      setFormData({ subject: '', message: '' });
    } catch (error) {
      alert("Erreur lors de l'envoi du message");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Contact</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Sujet</label>
          <input
            type="text"
            className="border p-2 rounded w-full"
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
          />
        </div>
        <div>
          <label className="block mb-2">Message</label>
          <textarea
            className="border p-2 rounded w-full h-32"
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default Contact;