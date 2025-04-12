import { useState } from "react";

const MessageForm = ({ onSend, onCancel }) => {
  const [content, setContent] = useState("");
  const [objet, setObjet] = useState("");
  const [destinataire, setDestinataire] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content || !objet || !destinataire) return;

    const newMessage = {
      author: "Administrateur FADIABA",
      destinataire,
      objet,
      content,
      date: new Date().toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      role: "admin",
    };

    onSend(newMessage);
    setContent("");
    setObjet("");
    setDestinataire("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 p-4 bg-white rounded-lg shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Destinataire *
          </label>
          <select
            value={destinataire}
            onChange={(e) => setDestinataire(e.target.value)}
            className="w-full p-2 border rounded bg-white"
            required
          >
            <option value="">Sélectionnez un destinataire</option>
            <option value="Clients">Tous les clients</option>
            <option value="Techniciens">Équipe technique</option>
            <option value="Service client">Service client</option>
            <option value="Administration">Administration</option>
            <option value="coach">daouda</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Objet *
          </label>
          <input
            type="text"
            value={objet}
            onChange={(e) => setObjet(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Objet du message"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Message *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
          placeholder="Contenu du message..."
          required
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Envoyer
        </button>
      </div>
    </form>
  );
};

export default MessageForm;