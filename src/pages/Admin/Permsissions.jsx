import { useState, useEffect } from "react";
import AddTechnicienModal from "../../components/Modals/AddTechnicienModal";
import { IoIosAdd } from "react-icons/io";
import axios from "axios";
import toast from "react-hot-toast";

export default function PermissionsAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  // Récupérer les utilisateurs depuis l'API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/auth/users",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        if (response.data.users) {
          setUsers(response.data.users);
        } else {
          setUsers([]);
        }
      } catch (error) {
        console.error(error);
        setError("Erreur lors de la récupération des utilisateurs");
        toast.error("Erreur lors de la récupération des utilisateurs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (userId, newRole) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, role: newRole } : user
      )
    );
    setEditingUser(userId);
  };

  const handleSubmit = async (userId) => {
    setIsLoading(true);
    setError("");

    try {
      const userToUpdate = users.find((user) => user._id === userId);
      if (!userToUpdate) return;

      const response = await axios.put(
        `http://localhost:4000/api/auth/users/${userId}`,
        { role: userToUpdate.role },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Rôle mis à jour avec succès");
        setEditingUser(null);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour");
      toast.error(
        err.response?.data?.message || "Erreur lors de la mise à jour"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Permissions
        </h1>

        {showModal && <AddTechnicienModal setShowModal={setShowModal} />}

        <button
          className="px-4 py-2 text-orange-500 border-2 border-orange-500 rounded flex items-center text-md hover:bg-orange-500 hover:text-white transition"
          onClick={() => setShowModal(true)}
        >
          <IoIosAdd className="mr-2" />
          Ajouter un Technicien
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        {isLoading && users.length === 0 ? (
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
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 capitalize">{user.prenom}</td>
                  <td className="py-3 px-4 capitalize">{user.nom}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <label>
                      <select
                        name="role"
                        className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-300"
                        value={user.role}
                        onChange={(e) =>
                          handleRoleChange(user._id, e.target.value)
                        }
                        disabled={isLoading && editingUser === user._id}
                      >
                        <option value="admin">Admin</option>
                        <option value="technicien">Technicien</option>
                        <option value="client">Client</option>
                      </select>
                    </label>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className={`px-4 py-2 rounded transition ${
                        editingUser === user._id
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => handleSubmit(user._id)}
                      disabled={isLoading && editingUser === user._id}
                    >
                      {isLoading && editingUser === user._id
                        ? "En cours..."
                        : "Sauvegarder"}
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
