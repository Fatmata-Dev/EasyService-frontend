import { useOutletContext } from 'react-router-dom';
import { useGetAvisQuery, useGetServicesQuery, useGetCategoriesQuery } from '../../API/servicesApi';
import { useGetDemandeForClientIdQuery } from '../../API/demandesApi';
import { useGetUsersQuery } from '../../API/authApi';
import { FaStar, FaRegStar, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import AvisCardClient from '../../components/cards/AvisCardClient';

const AvisClient = () => {
  const { user } = useOutletContext();

  // Récupération des données
  const { data: demandes = [], isLoading: isLoadingDemandes } = useGetDemandeForClientIdQuery(user?._id, {
    skip: !user?._id
  });
  let { data: existingAvis = [], refetch: refetchAvis } = useGetAvisQuery();
  const { data: services = [] } = useGetServicesQuery();
  const { data: categories = [] } = useGetCategoriesQuery();
  const { data: personne = [] } = useGetUsersQuery();

  console.log(existingAvis);
  existingAvis = existingAvis.filter(avis => avis.client._id === user?._id);


  // Formatage de date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      return format(isNaN(date) ? new Date() : date, "dd MMM yyyy", { locale: fr });
    } catch {
      return "-";
    }
  };

  // console.log(existingAvis);

  // Fonctions utilitaires
  const getCategorieNom = (categorieId) => {
    return categories.find(cat => cat._id === categorieId)?.nom || "-";
  };

  const getServiceById = (serviceId) => {
    return services.find(service => service._id === serviceId) || { nom: "Service inconnu" };
  };

  const getUserById = (userId) => {
    return personne.find(pers => pers._id === userId) || { nom: "Admin inconnu" };
  };

  // Filtrer les demandes terminées non encore notées
  const demandesANoter = demandes.filter(demande => 
    demande.statut === 'terminee' && 
    !existingAvis.some(avis => avis?.demande?._id === demande._id)
  );


  // Animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  if (isLoadingDemandes) {
    return (
      <div className="h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-gray-50 p-4"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Services à noter */}
        {demandesANoter.length > 0 && (
          <>
            <div className="flex justify-center mb-8">
              <h1 className="text-2xl font-bold text-gray-800">
                Services à évaluer ({demandesANoter.length})
              </h1>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
            >
              {[...demandesANoter].reverse().map((demande) => {
                const service = getServiceById(demande.service._id);
                const category = getCategorieNom(demande.categorieService);
                
                return (
                  <motion.div key={demande._id} variants={itemVariants}>
                    <AvisCardClient
                      demande={demande}
                      review={{
                        id: demande._id,
                        image: service.image || "/image3.jpeg",
                        service: service.nom,
                        serviceId: service._id,
                        date: formatDate(demande.dateDemande),
                        price: service.tarif ? `${service.tarif} XOF` : "Non spécifié",
                        status: "Noter",
                        category: category,
                        note: demande.note,
                        description: service.description,
                        client: `${user.prenom} ${user.nom}`,
                        demandeId: demande._id,
                        technicienId: demande.technicien?._id,
                      }}
                      refetchAvis={refetchAvis}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        {/* Section Avis déjà donnés */}
        {existingAvis.length > 0 && (
          <div className={`${demandesANoter.length > 0 ? "mt-12" : ""}`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Vos évaluations ({existingAvis.length})
            </h2>
            <div className="space-y-6">
              {[...existingAvis].reverse().map((avis) => {
                const admin = getUserById(avis?.demande?.admin);

                return (
                  <motion.div 
                    key={avis._id} 
                    className="bg-white rounded-lg shadow-md p-6"
                    variants={itemVariants}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="bg-orange-100 text-orange-600 rounded-full p-3">
                            <FaStar className="text-xl" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-800">
                              {avis?.service?.nom}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Terminé le {formatDate(avis?.demande?.dates?.finIntervention)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center mb-4">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="text-xl mr-1">
                              {i < avis.note ? (
                                <FaStar className="text-yellow-400" />
                              ) : (
                                <FaRegStar className="text-gray-300" />
                              )}
                            </span>
                          ))}
                          <span className="ml-2 text-gray-600">
                            {avis.note}/5
                          </span>
                        </div>

                        <p className="text-gray-700 italic border-l-4 border-orange-200 pl-4 py-2 bg-gray-50 rounded">
                          "{avis.commentaire}"
                        </p>
                      </div>

                      <div className="md:w-1/3 border-l md:pl-6 pl-3">
                        <div className="flex items-center gap-3 mb-4">
                          {avis?.technicien?.image ? (
                            <img 
                              src={avis?.technicien?.image?.url || `https://ui-avatars.com/api/?name=${avis?.technicien?.prenom}+${avis?.technicien?.nom}&background=random`} 
                              // alt={`${avis?.technicien?.prenom} ${avis?.technicien?.nom}`}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <FaUserCircle className="text-4xl text-gray-400" />
                          )}
                          <div>
                            <h4 className="font-medium capitalize">
                              {avis?.technicien?.prenom && avis?.technicien?.prenom.length > 8 ? `${avis?.technicien?.prenom.slice(0, 1) || ""}. ` : `${avis?.technicien?.prenom}`} {" "}
                              { avis?.technicien?.nom && avis?.technicien?.nom.length > 7 ? `${avis?.technicien?.nom.charAt(0).toUpperCase() || ""}. ` : `${avis?.technicien?.nom}`}
                            </h4>
                            <p className="text-sm text-gray-500">Technicien</p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 space-y-2">
                          <p>
                            <span className="font-medium">Date d'évaluation : </span> {formatDate(avis.dateSoumission)}
                          </p>
                          {avis?.service?.tarif && (
                            <p>
                              <span className="font-medium">Prix : </span> {avis?.service?.tarif} FCFA
                            </p>
                          )}
                          <p>
                            <span className="font-medium">Admin : </span>
                            
                            <span className='capitalize'>{admin?.prenom && admin?.prenom.length > 8 ? `${admin?.prenom.slice(0, 1) || ""}. ` : `${admin?.prenom}`} {" "}
                            { admin?.nom && admin?.nom.length > 7 ? `${admin?.nom.charAt(0).toUpperCase() || ""}. ` : `${admin?.nom}`}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center mt-2">
                        <Link
                          to={`/${user.role}/demandes/${avis?.demande?._id}`}
                          className="block text-center text-blue-500 hover:underline"
                        >
                          Voir le service
                        </Link>
                      </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Message quand il n'y a rien */}
        {demandesANoter.length === 0 && existingAvis.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              Vous n'avez aucun service à évaluer pour le moment.
            </p>
            <p className="text-gray-500 mt-2">
              Vos services terminés apparaîtront ici pour évaluation.
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AvisClient;