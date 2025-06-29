import { useState, useEffect } from "react";
import AddTechnicienModal from "../../components/Modals/AddTechnicienModal";
import { 
  IoIosAdd, 
  IoMdSave, 
  IoMdClose,
  IoMdLock,
  IoMdUnlock,
  IoMdTrash,
  IoMdBuild 
} from "react-icons/io";
import { useGetUsersQuery, useUpdateUserRoleMutation, useBlockUserMutation, useUnblockUserMutation } from "../../API/authApi";
import toast from "react-hot-toast";
import TechnicienInfoModal from "../../components/Modals/TechnicienInfoModal";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function PermissionsAdmin() {
  const [blockUser] = useBlockUserMutation();
  const [unblockUser] = useUnblockUserMutation();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTechModal, setShowTechModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [tempRole, setTempRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // RTK Query hooks
  const { data: usersData, isLoading, error, refetch } = useGetUsersQuery();
  const [updateUserRole] = useUpdateUserRoleMutation();

  useEffect(() => {
    if (usersData) {
      setUsers(usersData || []);
    }
  }, [usersData]);

  // console.log(users);

  const handleRoleChange = (userId, newRole) => {
    const user = users.find(u => u._id === userId);
    setTempRole(newRole);
    setSelectedUser(user);
    
    if (newRole === 'technicien' && user.role !== 'technicien') {
      setShowTechModal(true);
    } else {
      confirmRoleChange(userId, newRole);
    }
  };

  const confirmRoleChange = (userId, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(user => {
        if (user._id === userId) {
          // Si changement vers non-technicien, supprimer les attributs spécifiques
          if (user.role === 'technicien' && newRole !== 'technicien') {
            const { metier, categories, telephone, firstConnexion, disponible, ...rest } = user;
            metier, categories, telephone, firstConnexion, disponible;
            return { ...rest, role: newRole };
          }
          return { ...user, role: newRole };
        }
        return user;
      })
    );
    setEditingUser(userId);
  };

  const handleSubmit = async (userId) => {
    try {
      const userToUpdate = users.find(user => user._id === userId);
      if (!userToUpdate) return;

      await updateUserRole({
        id: userId,
        body: { 
          role: userToUpdate.role,
          // Si devient technicien, conserver les infos existantes
          ...(userToUpdate.role === 'technicien' ? {
            metier: userToUpdate.metier || '',
            categories: userToUpdate.categories || [],
            telephone: userToUpdate.telephone || '',
            firstConnexion: userToUpdate.firstConnexion !== undefined ? userToUpdate.firstConnexion : true,
            disponible: userToUpdate.disponible !== undefined ? userToUpdate.disponible : true,
            image: userToUpdate.image,
          } : {})
        }
      }).unwrap();

      toast.success("Rôle mis à jour avec succès");
      setEditingUser(null);
      refetch();
    } catch (err) {
      toast.error(err.data?.message || "Erreur lors de la mise à jour");
      refetch(); // Recharger les données originales
    }
  };

  
  const toggleUserStatus = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await unblockUser(userId).unwrap();
        toast.success('Utilisateur débloqué avec succès');
      } else {
        await blockUser(userId).unwrap();
        toast.success('Utilisateur bloqué avec succès');
      }
      refetch(); // Recharger la liste des utilisateurs
    } catch (err) {
      toast.error(err.data?.message || 'Erreur lors de la modification');
      console.log(err)
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between flex-wrap gap-2 items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Gestion des Permissions
        </h1>

        <button
          className="px-4 py-2 text-orange-500 border-2 border-orange-500 rounded flex items-center text-md hover:bg-orange-500 hover:text-white transition"
          onClick={() => setShowAddModal(true)}
        >
          <IoIosAdd className="mr-2" />
          Nouveau Technicien
        </button>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error.message || "Erreur lors de la récupération des utilisateurs"}
        </div>
      )}

      <div className="overflow-x-auto bg-white p-4 shadow-md rounded-lg">
        {isLoading && users.length === 0 ? (
          <div className="text-center text-gray-500 w-full h-screen">
            <LoadingSpinner />
          </div>
        ) : users.length === 0 ? (
          <p className="text-center text-gray-500">Aucun utilisateur trouvé</p>
        ) : (
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200">
              <tr className="text-left text-gray-700">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Prénom</th>
                <th className="py-3 px-4">Nom</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Rôle</th>
                <th className="py-3 px-4">Statut</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user._id} className="border-b border-gray-300 hover:bg-gray-50">
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4 capitalize">{user.prenom}</td>
                  <td className="py-3 px-4 capitalize">{user.nom}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      className="border border-gray-300 p-2 rounded focus:ring focus:ring-blue-300 max-w-[110px]"
                      value={user.role || ''}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={isLoading && editingUser === user._id}
                    >
                      <option value="">-- Sélectionner --</option>
                      <option value="admin">Admin</option>
                      <option value="technicien">Technicien</option>
                      <option value="client">Client</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.bloque ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.bloque ? 'Bloqué' : 'Actif'}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex space-x-2">
                    {editingUser === user._id ? (
                      <>
                        <button
                          className="p-2 text-green-500 hover:text-green-700"
                          onClick={() => handleSubmit(user._id)}
                          title="Sauvegarder"
                        >
                          <IoMdSave size={20} />
                        </button>
                        <button
                          className="p-2 text-gray-500 hover:text-gray-700"
                          onClick={() => {
                            setEditingUser(null);
                            refetch();
                          }}
                          title="Annuler"
                        >
                          <IoMdClose size={20} />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className={`p-2 ${user.bloque ? 'text-green-500 hover:text-green-700' : 'text-red-500 hover:text-red-700'}`}
                          onClick={() => toggleUserStatus(user._id, user.bloque)}
                          title={user.bloque ? 'Débloquer' : 'Bloquer'}
                        >
                          {user.bloque ? <IoMdUnlock size={20} /> : <IoMdLock size={20} />}
                        </button>
                        {user.role === 'technicien' && (
                          <button
                            className="p-2 text-blue-500 hover:text-blue-700"
                            title="Détails technicien"
                            onClick={() => {
                              setSelectedUser(user);
                              setShowTechModal(true);
                            }}
                          >
                            <IoMdBuild size={20} />
                          </button>
                        )}
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showAddModal && (
        <AddTechnicienModal 
          setShowModal={setShowAddModal} 
          refetchUsers={refetch}
        />
      )}

      {showTechModal && selectedUser && (
        <TechnicienInfoModal
          setShowModal={setShowTechModal}
          user={selectedUser}
          // onSubmit={handleTechInfoSubmit}
          isNew={tempRole === 'technicien' && selectedUser.role !== 'technicien'}
        />
      )}
    </div>
  );
}