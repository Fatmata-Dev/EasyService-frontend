import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";

export default function TechnicienInfoModal({ setShowModal, user, onSubmit, isNew }) {
  const [formData, setFormData] = useState({
    metier: user.metier || '',
    telephone: user.telephone || '',
    categories: user.categories || [],
    disponible: user.disponible !== undefined ? user.disponible : true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isNew && (!formData.metier || !formData.telephone)) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    onSubmit(formData);
    setShowModal(false);
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
            <label className="block text-gray-700 mb-2">Catégories</label>
            <input
              type="text"
              name="categories"
              value={formData.categories.join(', ')}
              onChange={(e) => {
                const categories = e.target.value.split(',').map(c => c.trim());
                setFormData(prev => ({ ...prev, categories }));
              }}
              className="w-full p-2 border rounded"
            />
            <p className="text-xs text-gray-500 mt-1">Séparer par des virgules</p>
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
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}