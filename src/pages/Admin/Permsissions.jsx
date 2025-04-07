import { useState, useEffect } from "react";
import AddTechnicienModal from "../../components/Modals/AddTechnicienModal";
import { IoIosAdd } from "react-icons/io";

export default function PermissionsAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🔹 Récupérer les utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://easyservice-backend-iv29.onrender.com/api/auth/users"
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des utilisateurs.");
        }
        const data = await response.json();

        console.log("Données reçues de l'API:", data); // Debug

        // Vérifie si data est bien un tableau avant de le stocker
        if (Array.isArray(data.users)) {
          setUsers(data.users); // Utilise uniquement le tableau des utilisateurs
        } else {
          console.error("L'API ne renvoie pas un tableau:", data);
          setUsers([]); // Évite l'erreur en mettant un tableau vide
        }
      } catch (error) {
        console.error(error);
        setUsers([]); // Gestion de l'erreur : stocke un tableau vide pour éviter l'erreur .map()
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // 🔹 Met à jour le rôle d'un utilisateur (localement)
  const handleRoleChange = (id, newRole) => {
    setUsers(
      users.map((user) => (user._id === id ? { ...user, role: newRole } : user))
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Permissions
        </h1>

        {/* Affichage du modal */}
        {showModal && <AddTechnicienModal setShowModal={setShowModal} />}

        {/* Bouton pour afficher le modal */}
        <button
          className="px-4 py-2 text-orange-500 border-2 border-orange-500 rounded-lg flex items-center text-md hover:bg-orange-500 hover:text-white transition"
          onClick={() => setShowModal(true)}
        >
          <IoIosAdd className="text-3xl mr-2" />
          Ajouter un Technicien
        </button>
      </div>

      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        {isLoading ? (
          <p className="text-center text-gray-500">
            Chargement des utilisateurs...
          </p>
        ) : (
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr className="text-left text-gray-700">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Prénom</th>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{user.prenom}</td>
                  <td className="py-3 px-4">{user.nom}</td>
                  <td className="py-3 px-4">
                    <select
                      className="border border-gray-300 p-2 rounded-md focus:ring focus:ring-blue-300"
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                    >
                      <option value="admin">Admin</option>
                      <option value="technicien">Technicien</option>
                      <option value="client">Client</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <button className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition">
                      Sauvegarder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}