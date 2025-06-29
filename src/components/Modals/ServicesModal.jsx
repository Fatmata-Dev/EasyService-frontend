import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} from "../../API/servicesApi";
import { useAuth } from "../../context/useAuth";

const ServicesModal = ({
  setShowModal,
  selectedService,
  isEditing,
}) => {
  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const { data: categories = [] } = useGetCategoriesQuery();
  // console.log("Catégories:", categories);

  const [createCategory] = useCreateCategoryMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm();
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const { user: userData } = useAuth();
  const userId = userData?._id;

  useEffect(() => {
    if (selectedService) {
      const fields = [
        "nom",
        "description",
        "tarif",
        "duree",
        "uniteDuree",
        "categorie",
        "image",
      ];
      fields.forEach((field) => {
        const value = selectedService[field];
        if (value) setValue(field, field === "categorie" ? value._id : value);
        // console.log("selectedService", selectedService);
      });
      setImagePreview(selectedService.image);
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (categories.length > 0 && selectedService) {
      const selectedCategory = categories.find(
        (cat) => cat._id === selectedService.categorie
      );
      // console.log("Catégorie trouvée :", selectedCategory);
    }
  }, [categories, selectedService]);

  //   console.log("selectedService:", selectedService);
  // console.log("categorie dans form:", watch("categorie"));
  // console.log("categories:", categories);

  // Gestion de l'image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setValue("image", file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      toast.error("Veuillez sélectionner une image valide");
    }
  };

  // Gestion de la catégorie
  const handleCreateCategory = async () => {
    if (!newCategory) return;

    try {
      const response = await createCategory({ nom: newCategory }).unwrap();
      setValue("categorie", response._id);
      setShowCategoryInput(false);
      setNewCategory("");
      toast.success("Catégorie créée avec succès");
    } catch (err) {
      toast.error(err.data?.message || "Erreur lors de la création");
    }
  };

  // CORRECTION APPLIQUÉE ICI 👇
  const onSubmit = async (data) => {
    try {
      if (!userId) throw new Error("Authentification requise");
      if (!data.categorie) throw new Error("Catégorie obligatoire");

      const formData = new FormData();

      // Séparation de l'image des autres données
      const { image, ...otherData } = data;

      // Ajout des autres champs
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value);
        }
      });

      // Ajout conditionnel de l'image
      if (image instanceof File) {
        formData.append("image", image);
      }

      formData.append("admin", userId);

      if (isEditing && selectedService?._id) {
        await updateService({
          id: selectedService._id,
          body: formData,
        }).unwrap();
        toast.success("Service modifié avec succès");
      } else {
        await createService(formData).unwrap();
        toast.success("Service créé avec succès");
      }

      // onSuccess();
      setShowModal(false);
    } catch (error) {
      console.error("Erreur:", error);
      toast.error(
        error.data?.message || error.message || "Erreur lors de la sauvegarde"
      );
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => setShowModal(false)}
    >
      <div
        className="bg-white rounded-lg px-8 py-4 min-w-[200px] w-[800px] m-5 max-h-[90vh] overflow-y-auto hide-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="uppercase border-b-2 border-dashed w-full mb-2 font-bold text-xl text-orange-500 text-center">
          {isEditing ? "Modifier le service" : "Ajouter un service"}
        </h3>

        {/* {errors && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {errors}
          </div>
        )} */}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            {/* Nom du Service */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Nom du Service 
              </label>
              <input
                {...register("nom", {
                  required: "Ce champ est obligatoire",
                  maxLength: { value: 50, message: "Maximum 50 caractères" },
                })}
                placeholder="Nom du service"
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nom.message}
                </p>
              )}
            </div>

            {/* Catégorie */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Catégorie 
              </label>
              {categories.length === 0 ? (
                <p>Chargement des catégories...</p>
              ) : (
                <select
                  {...register("categorie", {
                    required: "Ce champ est obligatoire",
                  })}
                  className="py-2 block w-full rounded px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((item) => (
                    <option key={item._id} value={item._id}>
                      {item.nom}
                    </option>
                  ))}
                </select>
              )}

              {showCategoryInput ? (
                <div className="mt-2 flex gap-2">
                  <input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
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
              {errors.categorie && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.categorie.message}
                </p>
              )}
            </div>
          </div>

          {/* Durée */}
          <div className="flex flex-col md:flex-row md:gap-5 w-full">
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">Durée</label>
              <input
                type="number"
                {...register("duree", { min: 0 })}
                placeholder="Ajoutez la durée minimale"
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
            </div>

            {/* Unité de Durée */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Unité Durée
              </label>
              <select
                {...register("uniteDuree")}
                className="py-2 block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              >
                <option value="">Sélectionnez une unité</option>
                <option value="heures">Heures</option>
                <option value="minutes">Minutes</option>
                <option value="jours">Jours</option>
              </select>
            </div>

            {/* Tarif */}
            <div className="mb-4 w-full">
              <label className="block font-bold text-gray-700">
                Tarif (XOF) *
              </label>
              <input
                type="number"
                {...register("tarif", {
                  required: "Ce champ est obligatoire",
                  min: {
                    value: 0,
                    message: "Le tarif ne peut pas être négatif",
                  },
                })}
                placeholder="Ajoutez le tarif de base"
                className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              />
              {errors.tarif && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.tarif.message}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">Description</label>
            <textarea
              {...register("description", { maxLength: 500 })}
              className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border border-gray-400 bg-gray-200 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-500 focus:outline-orange-500 sm:text-sm/6"
              rows="3"
              placeholder="Ajoutez une description pour le service"
            />
            <p className="text-right text-sm text-gray-500 mt-1">
              {watch("description")?.length || 0}/500
            </p>
          </div>

          {/* Image */}
          <div className="mb-4 w-full">
            <label className="block font-bold text-gray-700">
              Image {!isEditing && "(Recommandée)"}
            </label>
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
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300"
            >
              {isCreating || isUpdating ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicesModal;
