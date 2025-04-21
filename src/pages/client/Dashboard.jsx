import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import React from "react";

const Dashboard = () => {
  const formatDate = (dateString) => {
    return format(parseISO(dateString), "dd/MM/yyyy", { locale: fr });
  };
  const [loading, setLoading] = useState(true);
  const [demandes, setDemandes] = useState([]);
  const [error, setError] = useState(null);
  const userData = JSON.parse(localStorage.getItem("user"));
  const clientId = userData?.id;

  const fetchDemandes = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/demandes/client/${clientId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des demandes :", error);
      setError("Erreur lors du chargement des demandes");
      return null;
    }
  }, [clientId]);

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(
        `https://easyservice-backend-iv29.onrender.com/api/categories/${categoryId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data.nom;
    } catch (error) {
      console.error("Erreur lors de la récupération de la catégorie :", error);
      return "Inconnu";
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!clientId) {
        setError("Client ID non trouvé");
        setLoading(false);
        return;
      }

      try {
        const demandesData = await fetchDemandes();

        if (demandesData) {
          // Inverse l'ordre des demandes (les plus récentes en premier)
          const reversedDemandes = [...demandesData].reverse();

          // Met à jour les catégories en parallèle
          const demandesWithCategories = await Promise.all(
            reversedDemandes.map(async (demande) => {
              if (demande?.service?.categorie) {
                const categoryName = await fetchCategoryName(
                  demande.service.categorie
                );
                return {
                  ...demande,
                  service: {
                    ...demande.service,
                    categorie: categoryName,
                  },
                };
              }
              return demande;
            })
          );

          setDemandes(demandesWithCategories);
        }
      } catch (err) {
        console.error("Erreur lors du chargement des données:", err);
        setError("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [fetchDemandes, clientId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-4">
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="uppercase text-center font-bold text-lg mb-4">
          Demandes
        </h3>

        {demandes.length === 0 ? (
          <p className="text-center text-gray-500">Aucune demande trouvée</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nom</th>
                  <th className="px-6 py-3 text-left">Catégorie</th>
                  <th className="px-6 py-3 text-left">Tarif</th>
                  <th className="px-6 py-3 text-left">Date de soumission</th>
                  <th className="px-6 py-3 text-left">Date intervention</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((demande, index) => (
                  <tr
                    key={demande._id}
                    className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                  >
                    <td className="px-6 py-4 border-b">
                      {demande?.service?.nom || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {demande?.service?.categorie || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {demande.tarif || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {formatDate(demande.dateDemande) || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      {formatDate(demande.dateIntervention) || "-"}
                    </td>
                    <td className="px-6 py-4 border-b">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          demande.statut === "En cours"
                            ? "bg-blue-100 text-blue-800"
                            : demande.statut === "En attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {demande.statut || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Link
            to="/client/demandes"
            className="text-orange-500 font-bold flex items-center gap-2 hover:underline"
          >
            Voir toutes les demandes <FaLongArrowAltRight />
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="uppercase text-center font-bold text-lg mb-4">
          Messages
        </h3>
        <div className="flex items-center bg-gray-200 p-3 rounded-lg mb-3">
          <div className="bg-orange-400 text-white rounded-full w-10 h-10 flex items-center justify-center mr-3">
            <span>A</span>
          </div>
          <div>
            <p className="font-bold">Admin Fadiaba</p>
            <p className="text-gray-600">
              Bonjour {userData?.prenom || ""}, votre demande a été acceptée
            </p>
          </div>
        </div>
        <div className="flex justify-end">
          <Link
            to="/client/messages"
            className="text-orange-500 font-bold flex items-center gap-2 hover:underline"
          >
            Voir tous les messages <FaLongArrowAltRight />
          </Link>
        </div>
      </div>

      {/* Services */}
      <div className="bg-gray-100 rounded-lg p-4">
        <h3 className="uppercase text-center font-bold text-lg mb-4">
          Services
        </h3>
        <p className="text-center text-gray-500">Section services à venir</p>
      </div>
    </div>
  );
};

export default Dashboard;
