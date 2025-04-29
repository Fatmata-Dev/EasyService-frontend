import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useUpdateToTechnicienMutation } from "../../API/authApi";
import { useCreateCategoryMutation, useGetCategoriesQuery } from "../../API/servicesApi";

export default function TechnicienInfoModal({ setShowModal, user, isNew }) {
  const [updateToTechnicien, { isLoading: isCreatingTechnicien, error }] = useUpdateToTechnicienMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [formData, setFormData] = useState({
    ...user,
    metier: user.metier || '',
    telephone: user.telephone || '',
    categorie: user.categorie || null, // Utilisez null au lieu d'une chaîne vide
    disponible: user.disponible !== undefined ? user.disponible : true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    
      // Création d'un nouveau technicien
      const {...dataToSend } = formData;
      await updateToTechnicien({ id: user._id, body: dataToSend }).unwrap();
      toast.success("Utilisateur mis à jour avec succès");
    
    setShowModal(false);
  } catch (err) {
    toast.error(err.data?.message || "Erreur lors de l'opération");
  }
};

  const handleCreateCategory = async () => {
    if (!newCategory) return;

    try {
      const response = await createCategory({ nom: newCategory }).unwrap();
      setFormData(prev => ({
        ...prev,
        categorie: response._id
      }));
      setShowCategoryInput(false);
      setNewCategory("");
      toast.success("Catégorie créée avec succès");
    } catch (err) {
      toast.error(err.data?.message || "Erreur lors de la création de la catégorie");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {isNew ? 'Nouveau Technicien' : 'Informations Technicien'}
          </h2>
          <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
            <IoMdClose size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Métier</label>
            <input
              type="text"
              name="metier"
              value={formData.metier}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={isNew}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required={isNew}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Catégorie</label>
            {categories.length === 0 ? (
              <p>Chargement des catégories...</p>
            ) : (
              <>
                <select
                  name="categorie"
                  value={formData.categorie || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categorie: e.target.value
                    }))
                  }
                  required                  
                  className="py-2 block w-full rounded px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.nom}
                    </option>
                  ))}
                </select>
                {!formData.categorie && (
                  <p
                    onClick={() => setShowCategoryInput(true)}
                    className="text-xs text-orange-500 mt-2 hover:underline hover:cursor-pointer hover:text-orange-700"
                  >
                    Créer une nouvelle catégorie
                  </p>
                )}
              </>
            )}

            {showCategoryInput && (
              <div className="mt-2 flex gap-2">
                <input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  type="text"
                  className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                  placeholder="Nouvelle catégorie"
                  required
                />
                <button
                  type="button"
                  onClick={handleCreateCategory}
                  className="bg-green-500 text-white px-3 rounded"
                >
                  ✓
                </button>
              </div>
            )}
            {error && <p className="text-red-500">{error.data?.message}</p>}
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="disponible"
              name="disponible"
              checked={formData.disponible}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="disponible" className="text-gray-700">
              Disponible
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreatingTechnicien}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-orange-300 flex items-center"
            >
              Enregistrer
              {isCreatingTechnicien && (
                <span className="ml-2 animate-spin">
                  <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}