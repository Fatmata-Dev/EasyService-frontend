import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  useCreateServiceMutation,
  useUpdateServiceMutation 
} from '../../services/servicesApi';
import axios from 'axios';

const ServicesModal = ({ 
  setShowModal, 
  selectedService, 
  isEditing, 
  onSuccess 
}) => {
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const userId = userData?.id;

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await axios.get(
          "https://easyservice-backend-iv29.onrender.com/api/categories/all/categories",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setCategories(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories", err);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedService) {
      Object.entries(selectedService).forEach(([key, value]) => {
        setValue(key, value);
        if (key === 'image') {
          setImagePreview(value);
        }
      });
    }
  }, [selectedService, setValue]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleCreateCategory = async () => {
    if (newCategory) {
      try {
        const response = await axios.post(
          "https://easyservice-backend-iv29.onrender.com/api/categories/ajouter/categorie",
          { nom: newCategory },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setCategories(prev => [...prev, response.data]);
        setValue('categorie', response.data._id);
        setShowCategoryInput(false);
        setNewCategory('');
      } catch (err) {
        toast.error("Erreur lors de la création de la catégorie");
      }
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      formData.append('admin', userId);

      if (isEditing && selectedService?._id) {
        await updateService({ id: selectedService._id, body: formData }).unwrap();
        toast.success('Service modifié avec succès');
      } else {
        await createService(formData).unwrap();
        toast.success('Service créé avec succès');
      }

      onSuccess();
      setShowModal(false);
    } catch (error) {
      toast.error(error.data?.message || 'Erreur lors de la sauvegarde');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 min-w-[200px] w-[800px] m-5 max-h-screen overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="uppercase border-b-2 border-dashed w-full mb-2 font-bold text-xl text-orange-500 text-center">
          {isEditing ? "Modifier le service" : "Ajouter un service"}
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            {/* Nom du Service */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Nom du Service</label>
              <input
                placeholder="Entrez le nom du Service"
                id="nom"
                name="nom"
                type="text"
                defaultValue={selectedService?.nom}
                {...register('nom', { required: 'Ce champ est obligatoire' })}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
              {errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
            </div>

            {/* Catégorie */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Catégorie</label>
              <select
                {...register('categorie', { required: 'Ce champ est obligatoire' })}
                className="py-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              >
                <option value="">Sélectionnez une catégorie</option>
                {categories.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.nom}
                  </option>
                ))}
              </select>
              
              {showCategoryInput ? (
                <div className="mt-2 flex gap-2">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                    placeholder="Nouvelle catégorie"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="bg-green-500 text-white px-3 rounded"
                  >
                    ✓
                  </button>
                </div>
              ) : (
                <p
                  onClick={() => setShowCategoryInput(true)}
                  className="text-xs text-orange-500 mt-2 hover:underline hover:cursor-pointer hover:text-orange-700"
                >
                  Créer une nouvelle catégorie
                </p>
              )}
            </div>
          </div>

          {/* Autres champs */}
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            {/* Durée et Unité */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Durée</label>
              <input
                type="number"
                placeholder='Ex: 2'
                id='duree'
                name='duree'
                // value={formData.duree} 
                // onChange={handleInputChange}
                {...register('duree')}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>
            
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Unité Durée</label>
              <input
                type="text"
                placeholder='Ex: 2 heures'
                id='uniteDuree'
                name='uniteDuree'
                // value={formData.uniteDuree}
                // onChange={handleInputChange}
                {...register('uniteDuree')}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Tarif (XOF)</label>
              <input
                type="number"
                {...register('tarif', { required: 'Ce champ est obligatoire' })}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
              {errors.tarif && <p className="text-red-500 text-sm">{errors.tarif.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Description</label>
            <textarea
              placeholder='Mettez la description'
              type='text'
              id='description'
              name='description'
              // value={formData.description}
              // onChange={handleInputChange}
              {...register('description')}
              className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              rows="3"
            />
          </div>

          {/* Upload d'image */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Image</label>
            <div className="flex justify-center items-center w-full h-[200px] border border-gray-400 rounded relative">
              <div className="w-fit flex flex-col justify-center items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="opacity-0 h-[70px] absolute cursor-pointer z-10"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="62"
                  height="47"
                  viewBox="0 0 62 47"
                  fill="none"
                >
                  <path
                    d="M55.7776 46.3738H6.21618C3.05783 46.3738 0.497559 43.8135 0.497559 40.6552V6.34344C0.497559 3.18509 3.05783 0.624817 6.21618 0.624817H55.7776C58.9359 0.624817 61.4962 3.18509 61.4962 6.34344V40.6552C61.4962 43.8135 58.9359 46.3738 55.7776 46.3738ZM13.841 7.29654C10.1563 7.29654 7.16929 10.2836 7.16929 13.9683C7.16929 17.653 10.1563 20.64 13.841 20.64C17.5257 20.64 20.5127 17.653 20.5127 13.9683C20.5127 10.2836 17.5257 7.29654 13.841 7.29654ZM8.12239 38.749H53.8714V25.4055L43.445 14.9792C42.8867 14.4209 41.9815 14.4209 41.4231 14.9792L25.2783 31.1241L18.6643 24.5102C18.106 23.9519 17.2008 23.9519 16.6424 24.5102L8.12239 33.0303V38.749Z"
                    fill="#BDBDBD"
                  />
                </svg>
                <p>Ajoutez une image</p>
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Aperçu"
                  className="w-full h-[200px] object-cover absolute"
                />
              )}
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300"
            >
              {isCreating || isUpdating ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesModal;


// import { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";

// export default function ServicesModal({
//   setShowModal,
//   selectedService,
//   isEditing,
// }) {
//   const userData = JSON.parse(localStorage.getItem("user"));
//   const user = userData?.id;
//   const [categories, setCategories] = useState([]);
//   const fullImageUrl = selectedService?.image
//     ? `${selectedService.image}`
//     : null;
//   const [imagePreview, setImagePreview] = useState(fullImageUrl);
//   const [serviceId, setServiceId] = useState(selectedService?._id || null);

//   const [formData, setFormData] = useState({
//     nom: selectedService?.nom || "",
//     description: selectedService?.description || "",
//     tarif: selectedService?.tarif || "",
//     duree: selectedService?.duree || "",
//     uniteDuree: selectedService?.uniteDuree || "",
//     categorie: selectedService?.categorie?._id || "", // Prendre l'ID de l'objet catégorie
//     image: selectedService?.image || null,
//     admin: user,
//   });

//   useEffect(() => {
//     if (selectedService) {
//       setFormData({
//         nom: selectedService.nom || "",
//         description: selectedService.description || "",
//         tarif: selectedService.tarif || "",
//         duree: selectedService.duree || "",
//         uniteDuree: selectedService.uniteDuree || "",
//         categorie:
//           selectedService.categorie?._id || selectedService.categorie || "",
//         image: selectedService.image || null,
//         admin: user,
//       });
//       setServiceId(selectedService._id);
//     }
//   }, [selectedService, user]);

//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [showCategoryInput, setShowCategoryInput] = useState(false);
//   const [newCategory, setNewCategory] = useState("");

//   useEffect(() => {
//     return () => {
//       if (imagePreview) {
//         URL.revokeObjectURL(imagePreview);
//       }
//     };
//   }, [imagePreview]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setFormData((prev) => ({ ...prev, image: file }));
//       setImagePreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");

//     try {
//       let categoryId = formData.categorie;

//       // Vérification si une nouvelle catégorie doit être créée
//       if (showCategoryInput && newCategory) {
//         const categoryResponse = await axios.post(
//           "https://easyservice-backend-iv29.onrender.com/api/categories/ajouter/categorie",
//           { nom: newCategory },
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//             },
//           }
//         );
//         categoryId = categoryResponse.data._id;
//       }

//       // Création d'un objet FormData
//       const formDataToSend = new FormData();
//       formDataToSend.append("nom", formData.nom);
//       formDataToSend.append("description", formData.description);
//       formDataToSend.append("tarif", formData.tarif);
//       formDataToSend.append("duree", formData.duree);
//       formDataToSend.append("uniteDuree", formData.uniteDuree);
//       formDataToSend.append("categorie", categoryId);
//       formDataToSend.append("admin", user);

//       if (formData.image instanceof File) {
//         formDataToSend.append("image", formData.image);
//       }

//       let response;
//       if (isEditing && serviceId) {
//         // 🔄 Mode Édition : Requête PUT
//         response = await axios.put(
//           `      https://easyservice-backend-iv29.onrender.com/api/services/${serviceId}`,
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         toast.success("Service mis à jour avec succès !");
//       } else {
//         // ➕ Mode Ajout : Requête POST
//         response = await axios.post(
//           "      https://easyservice-backend-iv29.onrender.com/api/services/ajouter/service",
//           formDataToSend,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );
//         toast.success("Service ajouté avec succès !");
//       }

//       if (response.status === 200 || response.status === 201) {
//         setShowModal(false);
//       }
//     } catch (err) {
//       console.error("Erreur:", err.response?.data);
//       setError(err.response?.data?.message || "Une erreur s'est produite.");
//       toast.error("Une erreur s'est produite.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const getAllCategories = async () => {
//       try {
//         const response = await axios.get(
//           "      https://easyservice-backend-iv29.onrender.com/api/categories/all/categories",
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//             },
//           }
//         );
//         setCategories(response.data);
//       } catch (err) {
//         console.error("Erreur lors de la récupération des catégories", err);
//       }
//     };

//     getAllCategories();
//   }, []);

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
//       onClick={() => setShowModal(false)}
//     >
//       <div
//         className="bg-white rounded-lg px-8 py-4 min-w-[200px] w-[800px] m-5 max-h-screen overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h3 className="uppercase border-b-2 border-dashed w-full mb-2 font-bold text-xl text-orange-500 text-center">
//           {isEditing ? "Modifier le service" : "Ajouter un service"}
//         </h3>

//         {error && (
//           <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit}>
//           <div className="flex flex-col md:flex-row md:gap-5 w-full">
//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">
//                 Nom du Service
//               </label>
//               <input
//                 placeholder="Entrez le nom du Service"
//                 id="nom"
//                 name="nom"
//                 type="text"
//                 value={formData.nom}
//                 onChange={handleInputChange}
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//               />
//             </div>

//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">Categorie</label>
//               <select
//                 name="categorie"
//                 value={formData.categorie}
//                 onChange={handleInputChange}
//                 className="py-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//               >
//                 <option value="">Sélectionnez une catégorie</option>
//                 {categories.map((item) => (
//                   <option key={item._id} value={item._id}>
//                     {item.nom}
//                   </option>
//                 ))}
//               </select>
//               {showCategoryInput ? (
//                 <input
//                   placeholder="Nouvelle categorie"
//                   id="newCategory"
//                   name="newCategory"
//                   type="text"
//                   value={newCategory}
//                   onChange={(e) => setNewCategory(e.target.value)}
//                   className="mt-2 block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//                 />
//               ) : (
//                 <p
//                   onClick={() => setShowCategoryInput(true)}
//                   className="text-xs text-orange-500 mt-2 hover:underline hover:cursor-pointer hover:text-orange-700"
//                 >
//                   Creer une nouvelle categorie
//                 </p>
//               )}
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row md:gap-5 w-full">
//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">Durée</label>
//               <input
//                 placeholder="Ex: 2 heures"
//                 id="duree"
//                 name="duree"
//                 type="number"
//                 value={formData.duree}
//                 onChange={handleInputChange}
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//               />
//             </div>

//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">
//                 Unité Durée
//               </label>
//               <input
//                 placeholder="Ex: 2 heures"
//                 id="uniteDuree"
//                 name="uniteDuree"
//                 type="text"
//                 value={formData.uniteDuree}
//                 onChange={handleInputChange}
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//               />
//             </div>

//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">
//                 Tarif (XOF)
//               </label>
//               <input
//                 placeholder="Ex: 20000"
//                 id="tarif"
//                 name="tarif"
//                 type="number"
//                 value={formData.tarif}
//                 onChange={handleInputChange}
//                 className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row md:gap-5 w-full">
//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">
//                 Description
//               </label>
//               <div>
//                 <textarea
//                   placeholder="Mettez la description"
//                   type="text"
//                   id="description"
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col md:flex-row md:gap-5 w-full">
//             <div className="mb-4 w-full">
//               <label className="block font-bold text-gray-700">Image</label>
//               <div className="flex justify-center items-center w-full h-[200px] border border-gray-400 rounded relative">
//                 <div className="w-fit flex flex-col justify-center items-center">
//                   <input
//                     type="file"
//                     name="image"
//                     id="image"
//                     accept="image/*"
//                     onChange={handleFileChange}
//                     className="opacity-0 h-[70px] absolute cursor-pointer z-10"
//                   />
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="62"
//                     height="47"
//                     viewBox="0 0 62 47"
//                     fill="none"
//                   >
//                     <path
//                       d="M55.7776 46.3738H6.21618C3.05783 46.3738 0.497559 43.8135 0.497559 40.6552V6.34344C0.497559 3.18509 3.05783 0.624817 6.21618 0.624817H55.7776C58.9359 0.624817 61.4962 3.18509 61.4962 6.34344V40.6552C61.4962 43.8135 58.9359 46.3738 55.7776 46.3738ZM13.841 7.29654C10.1563 7.29654 7.16929 10.2836 7.16929 13.9683C7.16929 17.653 10.1563 20.64 13.841 20.64C17.5257 20.64 20.5127 17.653 20.5127 13.9683C20.5127 10.2836 17.5257 7.29654 13.841 7.29654ZM8.12239 38.749H53.8714V25.4055L43.445 14.9792C42.8867 14.4209 41.9815 14.4209 41.4231 14.9792L25.2783 31.1241L18.6643 24.5102C18.106 23.9519 17.2008 23.9519 16.6424 24.5102L8.12239 33.0303V38.749Z"
//                       fill="#BDBDBD"
//                     />
//                   </svg>
//                   <p>Ajoutez une image</p>
//                 </div>
//                 {imagePreview && (
//                   <img
//                     src={imagePreview}
//                     alt="Aperçu"
//                     className="w-full h-[200px] object-cover absolute"
//                   />
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className={`w-fit bg-orange-500 text-white font-bold py-2 px-4 rounded ${
//                 isLoading
//                   ? "bg-orange-400 cursor-not-allowed"
//                   : "hover:bg-orange-600"
//               }`}
//             >
//               {isLoading ? "Enregistrement..." : "Enregistrer"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
