import { useState } from "react";
import { useCreateTechnicienMutation } from "../../API/authApi";
import { useGetCategoriesQuery } from "../../API/servicesApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FiBriefcase, FiHash, FiLock, FiMail, FiPhone, FiUser, FiUserPlus, FiX } from "react-icons/fi";

export default function AddTechnicienModal({ setShowModal }) {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    metier: "",
    categorie: "",
    email: "",
    password: "passer",
    role: "technicien",
  });

  // Utilisation des mutations et queries RTK Query
  const [createTechnicien, { isLoading }] = useCreateTechnicienMutation();
  const { data: categories = [], isFetching: isFetchingCategories } = useGetCategoriesQuery();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await createTechnicien(formData).unwrap();
      
      toast.success(response?.message || "Technicien créé avec succès");
      setShowModal(false);
    } catch (err) {
      toast.error(err.data?.error || "Erreur lors de la création du technicien");
      console.error("Erreur:", err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        onClick={() => setShowModal(false)}
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <FiUserPlus className="mr-2 text-orange-500" />
              Ajouter un technicien
            </h3>
            <button 
              onClick={() => setShowModal(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <FiX size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Informations personnelles */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center">
                <FiUser size={16} className="mr-2 text-orange-500" />
                Informations personnelles
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Prénom
                  </label>
                  <div className="relative">
                    <input
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Nom
                  </label>
                  <input
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Téléphone
                  </label>
                  <div className="relative">
                    <FiPhone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="telephone"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Métier
                  </label>
                  <div className="relative">
                    <FiBriefcase size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="metier"
                      value={formData.metier}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Catégorie
                </label>
                <div className="relative">
                  <FiHash size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    name="categorie"
                    value={formData.categorie}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                    disabled={isFetchingCategories}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Informations de connexion */}
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700 flex items-center">
                <FiLock size={16} className="mr-2 text-orange-500" />
                Informations de connexion
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">
                    Mot de passe (par défaut)
                  </label>
                  <div className="relative">
                    <FiLock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      name="password"
                      value={formData.password}
                      readOnly
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-md hover:bg-orange-600 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}