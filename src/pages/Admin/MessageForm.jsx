import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useCreateMessageMutation } from "../../API/messagesApi";
import { useGetUsersQuery } from "../../API/authApi"; // Utilisez le hook existant

const MessageForm = ({ onCancel, initialData }) => {
  const [content, setContent] = useState("");
  const [objet, setObjet] = useState("");
  const [destinataires, setDestinataires] = useState([]);
  const [demandeId, setDemandeId] = useState("");
  const [userSearch, setUserSearch] = useState("");
  
  // Utilisation du hook existant getUsers
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const users = usersData || []; // Fallback si data est undefined
  
  const [createMessage, { isLoading }] = useCreateMessageMutation();
  
  // Initialisation avec les données existantes si on répond à un message
  useEffect(() => {
    if (initialData) {
      setObjet(initialData.objet || `Re: ${initialData.titre || initialData.objet || ''}`);
      setContent(initialData.contenu || "");
      
      if (initialData.expediteur) {
        // Lorsqu'on répond, on ajoute automatiquement l'expéditeur comme destinataire
        const expediteurEmail = initialData.expediteur.email;
        if (expediteurEmail && !destinataires.includes(expediteurEmail)) {
          setDestinataires([expediteurEmail]);
        }
      }
      
      if (initialData.demandeId) {
        setDemandeId(initialData.demandeId);
      }
    }
  }, [initialData, destinataires]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content || !objet || destinataires.length === 0) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    try {
      const newMessage = {
        titre: objet,
        objet: objet,
        contenu: content,
        destinataires: destinataires,
        demandeId: demandeId || undefined // Ne pas envoyer si vide
      };

      await createMessage(newMessage).unwrap();
      toast.success("Message envoyé avec succès");
      
      // Réinitialisation du formulaire
      setContent("");
      setObjet("");
      setDestinataires([]);
      setDemandeId("");
      
      // Fermer le formulaire si une fonction onCancel est fournie
      if (onCancel) onCancel();
    } catch (error) {
      toast.error(error.data?.error || "Erreur lors de l'envoi du message");
      console.error("Erreur lors de l'envoi du message", error);
    }
  };

  const addDestinataire = (email) => {
    if (!destinataires.includes(email)) {
      setDestinataires([...destinataires, email]);
      setUserSearch("");
    }
  };

  const removeDestinataire = (email) => {
    setDestinataires(destinataires.filter(d => d !== email));
  };

  const filteredUsers = users
    .filter(user => user && user.email) // Filtre les utilisateurs valides
    .filter(user => 
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      `${user.prenom || ''} ${user.nom || ''}`.toLowerCase().includes(userSearch.toLowerCase())
    )
    .filter(user => !destinataires.includes(user.email));

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        {initialData ? "Répondre au message" : "Nouveau message"}
      </h3>

      {/* Champ Destinataires */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Destinataires *
        </label>
        
        {/* Affichage des destinataires sélectionnés */}
        <div className="flex flex-wrap gap-2 mb-2">
          {destinataires.map(email => {
            const user = users?.find(u => u.email === email);
            return (
              <span 
                key={email} 
                className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-sm"
              >
                {user ? `${user.prenom} ${user.nom}` : email}
                <button 
                  type="button"
                  onClick={() => removeDestinataire(email)}
                  className="ml-1 text-gray-500 hover:text-red-500"
                >
                  &times;
                </button>
              </span>
            );
          })}
        </div>

        {/* Recherche et sélection des utilisateurs */}
        <div className="relative">
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Rechercher un utilisateur par email ou nom..."
          />
          {isLoadingUsers && (
              <p>Chargement des utilisateurs</p>
          )}
          
          {userSearch && (
            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {filteredUsers?.length > 0 ? (
                filteredUsers.map(user => (
                  <li 
                    key={user._id} 
                    className="p-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => addDestinataire(user.email)}
                  >
                    <div className="font-medium">{user.prenom} {user.nom}</div>
                    <div className="text-sm text-gray-600">{user.email}</div>
                  </li>
                ))
              ) : (
                <li className="p-2 text-gray-500">Aucun utilisateur trouvé</li>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Champ Objet */}
      <div className="mb-4">
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

      {/* Champ Contenu */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Message *
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
          placeholder="Contenu du message..."
          required
        />
      </div>

      {/* Champ optionnel pour lier à une demande */}
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Lier à une demande (optionnel)
        </label>
        <input
          type="text"
          value={demandeId}
          onChange={(e) => setDemandeId(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="ID de la demande"
        />
      </div>

      {/* Boutons d'action */}
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
          disabled={isLoading}
          className={`${isLoading ? 'bg-orange-400' : 'bg-orange-500 hover:bg-orange-600'} text-white font-bold py-2 px-4 rounded transition-colors`}
        >
          {isLoading ? 'Envoi en cours...' : 'Envoyer'}
        </button>
      </div>
    </form>
  );
};

export default MessageForm;