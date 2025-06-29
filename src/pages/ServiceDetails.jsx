import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import LoginModal from "../components/Modals/LoginModal";
import SignupModal from "../components/Modals/SignupModal";
import ForgetPasswordModal from "../components/Modals/ForgetPasswordModal";
import Navbar from "../components/navigation/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  let isConnected = true;

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById("Navbar");
      if (navbar) {
        navbar.style.position = "sticky";
        if (window.scrollY > 50) {
          navbar.classList.add("shadow-md");
        } else {
          navbar.classList.remove("shadow-md");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const getService = async () => {
      try {
        const response = await axios.get(
          `https://easyservice-backend-iv29.onrender.com/api/services/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              "Content-Type": "application/json",
            },
          }
        );
        setService(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Erreur serveur");
      } finally {
        setLoading(false);
      }
    };
    getService();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "À définir";
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handleReservation = () => {
    setShowLogin(true);
  };

  // if (loading)
  //   return <div className="text-center py-8">Chargement en cours...</div>;
  // if (error)
  //   return <div className="text-center py-8 text-red-500">{error}</div>;
  // if (!service)
  //   return <div className="text-center py-8">Service non trouvé</div>;

  return (
    <div className="pt-20">
      <Navbar defaultSection={"services"}/>
      
        
      <div className="mx-8 lg:mx-12 mt-2">
        <h1 className="text-2xl font-bold my-4 text-center self-center">
          DÉTAIL DU SERVICE
        </h1>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="flex flex-col lg:flex-row md:justify-center gap-8 lg:gap-5">
            <div className="flex justify-center itemes-center lg:w-1/2">
              <img
                src={service.image || "Image indisponible"}
                alt={service.nom || "Image indisponible"}
                className="sm:min-w-full w-full sm:max-w-lg rounded-lg shadow-md max-h-[400px] object-cover w-full"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "Image indisponible";
                }}
              />
            </div>

            <div className="flex flex-col gap-4 lg:w-1/2">
              <div className="w-full">
                <h2 className="text-xl font-bold mb-2 text-orange-500">
                  {service.nom?.toUpperCase()}
                </h2>
                <p className="text-gray-700 mb-4 font-semibold">
                  {service.categorie?.nom || "Catégorie non spécifiée"}
                </p>

                <p className="text-gray-700 whitespace-pre-line">
                  {service.description || "Aucune description disponible"}
                </p>
              </div>

              <div className="w-full">
                <div className="bg-orange-50 shadow-md p-6 rounded-lg border border-orange-100">
                  <p className="mb-3">
                    <strong>TARIF :</strong>{" "}
                    {service.tarif ? `${service.tarif} FCFA` : "Non spécifié"}
                  </p>
                  <p className="mb-3">
                    <strong>DUREE :</strong>{" "}
                    {service.duree
                      ? `${service.duree} ${service.uniteDuree || ""}`
                      : "Non spécifiée"}
                  </p>
                  <p className="mb-3">
                    <strong>DATE INTERVENTION :</strong>{" "}
                    {formatDate(service.dateIntervention)}
                  </p>
                  <p className="text-sm text-gray-600 mt-4">
                    Ajouté le{" "}
                    {service.createDate
                      ? new Date(service.createDate).toLocaleDateString("fr-FR")
                      : "date inconnue"}{" "}
                    par l&apos;admin{" "}
                    <strong className="text-orange-500 uppercase">
                      {service.admin?.prenom} {service.admin?.nom}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end mt-6 sticky bottom-3">
            <button
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 shadow-lg rounded transition"
              onClick={handleReservation}
            >
              Réserver ce service
            </button>
          </div>
          {/* Section Avis */}
                <div className="mt-8 pt-6 border-t">
                  <h2 className="text-xl font-bold mb-4">Avis des clients</h2>
                  
                  <p className="text-gray-500 italic">Connectez-vous pour voir les avis</p>
                </div>
        </>
      )}
      </div>

      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          message="Connectez-vous pour faire la réservation"
          isConnected={isConnected}
          onSwitchToSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onSwitchToForgetPassword={() => {
            setShowLogin(false);
            setShowForgetPassword(true);
          }}
        />
      )}

      {showSignup && (
        <SignupModal
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
      {showForgetPassword && (
        <ForgetPasswordModal
          onClose={() => setShowForgetPassword(false)}
          onSwitchToLogin={() => {
            setShowForgetPassword(false);
            setShowLogin(true);
          }}
        />
      )}

      
    {!service && (
        <div className="text-center py-8">Service non trouvé</div>
      )}

      {error && <div className="text-center py-8 text-red-500">{error}</div>}
    </div>
  );
};

export default ServiceDetails;
