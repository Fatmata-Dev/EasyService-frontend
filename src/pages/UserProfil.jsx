import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetUserConnetedQuery, useUpdateUserProfileMutation } from '../API/authApi';
import { toast } from 'react-hot-toast';

export default function UserProfil() {
  const { data: user, isLoading, isError, refetch } = useGetUserConnetedQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  // Initialiser le formulaire avec les données de l'utilisateur
// Correction de l'initialisation
useEffect(() => {
  if (user) {
    reset({
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      role: user.role || '',
      // Initialisation correcte de l'image
      image: user.image?.url || '' // Envoyer directement l'URL string
    });
    setPreviewImage(user.image?.url || null);
  }
}, [user, reset]);

// Correction de la soumission
const onSubmit = async (data) => {
  try {
    const formData = new FormData();
    
    // Ajouter les champs texte
    formData.append('nom', data.nom);
    formData.append('prenom', data.prenom);
    formData.append('email', data.email);
    
    // Ajouter le fichier s'il existe
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    await updateUser({ 
      id: user._id, 
      body: formData 
    }).unwrap();
    
    toast.success('Profil mis à jour!');
    refetch();
  } catch (error) {
    toast.error(error.data?.message || 'Erreur de mise à jour');
  }
};

  if (isLoading) return <div className="text-center py-8">Chargement du profil...</div>;
  if (isError) return <div className="text-center py-8 text-red-500">Erreur lors du chargement du profil</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Profil de {user?.nom} {user?.prenom}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="shrink-0 relative">
            <img
              className="h-24 w-24 object-cover rounded-full border-2 border-gray-200"
              src={previewImage || `https://ui-avatars.com/api/?name=${user?.prenom}+${user?.nom}&background=random`}
              alt="Photo de profil"
            />
            {selectedFile && (
              <span className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                Nouveau
              </span>
            )}
          </div>
          <div className="w-full">
            <label className="block mb-2">
              <span className="text-sm font-medium text-gray-700">Photo de profil</span>
              <input
                type="file"
                accept="image/*"
                {...register('image', { 
                  required: 'L\'image est requis',
                  minLength: {
                    value: 2,
                    message: 'L\'image doit être un fichier JPEG ou PNG'
                  }
                })}
                onChange={(e) => {
                  setSelectedFile(e.target.files[0]);
                  setPreviewImage(URL.createObjectURL(e.target.files[0]));
                }}
                className="mt-1 block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-orange-100 file:text-orange-700
                  hover:file:bg-orange-100"
              />
            </label>
            <p className="text-xs text-gray-500">Formats supportés: JPEG, JPG, PNG (max. 2MB)</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              {...register('nom', { 
                required: 'Le nom est requis',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères'
                }
              })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              {...register('prenom', {
                minLength: {
                  value: 2,
                  message: 'Le prénom doit contenir au moins 2 caractères'
                }
              })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
            />
            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide',
              },
            })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating || !isDirty && !selectedFile}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isUpdating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Enregistrement...
              </>
            ) : 'Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  );
}