import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useGetUserConnetedQuery, useUpdateUserProfileMutation } from '../API/authApi';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useGetCategoriesQuery } from '../API/servicesApi';

export default function UserProfil() {
  const { data: user, isLoading, isError, refetch } = useGetUserConnetedQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const { data: categoriesData } = useGetCategoriesQuery(); // Utilisez le bon hook
  
  // Fonction pour obtenir le nom de la catégorie
  const getCategorieNom = (categorieId) => {
    if (!categoriesData || !categorieId) return "-";
    const categorie = categoriesData.find(cat => cat._id === categorieId);
    return categorie?.nom || "-";
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch
  } = useForm();

  // Initialisation du formulaire
  useEffect(() => {
    if (user) {
      reset({
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        adresse: user.adresse || '',
        telephone: user.telephone || '',
        image: user.image?.url || '',
        password: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPreviewImage(user.image?.url || null);
    }
  }, [user, reset]);

  // Soumission du formulaire
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      
      // Ajouter les champs texte
      formData.append('nom', data.nom);
      formData.append('prenom', data.prenom);
      formData.append('email', data.email);
      formData.append('adresse', data.adresse);
      formData.append('telephone', data.telephone);
      
      // Ajouter le fichier s'il existe
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      // Gestion du mot de passe seulement si rempli
      if (data.password) {
        formData.append('password', data.password);
        formData.append('newPassword', data.newPassword);
      }

      await updateUser({ 
        id: user._id, 
        body: formData 
      }).unwrap();
      
      toast.success('Profil mis à jour!');
      refetch();
      setSelectedFile(null); // Réinitialiser le fichier sélectionné après succès
    } catch (error) {
      toast.error(error.data?.message || 'Erreur de mise à jour');
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen w-full"><LoadingSpinner /></div>;
  if (isError) return <div className="text-center py-8 text-red-500 w-full">Erreur lors du chargement du profil</div>;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Profil de <span className='capitalize'>{user?.prenom} {user?.nom}</span></h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Section Photo de profil */}
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
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                    setPreviewImage(URL.createObjectURL(e.target.files[0]));
                  }
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

        {/* Informations personnelles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              type="text"
              {...register('prenom', {
                required: 'Ce champ est requis',
                minLength: {
                  value: 2,
                  message: 'Le prénom doit contenir au moins 2 caractères'
                }
              })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
            />
            {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              type="text"
              {...register('nom', { 
                required: 'Ce champ est requis',
                minLength: {
                  value: 2,
                  message: 'Le nom doit contenir au moins 2 caractères'
                }
              })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
            />
            {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
        </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            {...register('email', {
              required: 'Ce champ est requis',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Email invalide',
              },
            })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Adresse */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
          <input
            type="text"
            placeholder='Ex : Keur Massar, Dakar, Senegal'
            {...register('adresse')}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
          />
        </div>
        
        {/* Téléphone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            {...register('telephone', {
              pattern: {
                value: /^\+[0-9]{1,3}[0-9]{9,15}$/,  
                message: 'Format invalide. Exemple: +221771234567',
              }
            })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border"
            placeholder="Ex : +221771234567"  
          />
          {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
        </div>

        {/* Champs spécifiques aux techniciens */}
        {user?.role === 'technicien' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Métier</label>
              <input
                type="text"
                readOnly
                value={user.metier || "-"}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <input
                type="text"
                readOnly
                value={getCategorieNom(user.categorie)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border bg-gray-100"
              />
            </div>
          </>
        )}

        {/* Section changement de mot de passe */}
        <div className="pt-4 border-t border-gray-200">
          <h2 className="text-lg font-medium mb-2">Changer le mot de passe</h2>
          <p className="text-sm text-gray-600 mb-4">Veuillez saisir votre mot de passe actuel et votre nouveau mot de passe.</p>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe actuel</label>
            <div className="flex items-center justify-center relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder='Entrez votre mot de passe actuel'
                {...register('password')}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 top-0 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe</label>
            <div className="flex items-center justify-center relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder='Mettez votre nouveau mot de passe'
                {...register('newPassword', {
                  minLength: {
                    value: 6,
                    message: 'Le mot de passe doit contenir au moins 6 caractères'
                  }
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
          </div>

          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
            <div className="flex items-center justify-center relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder='Confirmez votre nouveau mot de passe'
                {...register('confirmPassword', {
                  validate: (value) => 
                    !watch('newPassword') || value === watch('newPassword') || 
                    'Les mots de passe ne correspondent pas'
                })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 p-2 border pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={isUpdating || (!isDirty && !selectedFile && !watch('password'))}
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