import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import toast from "react-hot-toast";
import { useCallback } from "react";

export default function DashboardAdmin() {
  const [demandes, setDemandes] = useState(0);
  const [services, setServices] = useState(0);
  const [techniciens, setTechniciens] = useState(0);
  const [avis, setAvis] = useState(0);
  const [demandesParStatut, setDemandesParStatut] = useState([
    { statut: "En attente", nombre: 0 },
    { statut: "En cours", nombre: 0 },
    { statut: "Terminé", nombre: 0 },
    { statut: "Refusé", nombre: 0 },
  ]);
  const [loading, setLoading] = useState(true);

  const evolutionDemandes = [
    { semaine: "S1", demandes: 4 },
    { semaine: "S2", demandes: 6 },
    { semaine: "S3", demandes: 10 },
    { semaine: "S4", demandes: 7 },
  ];

  // Fonction pour normaliser les statuts
  const normalizeStatut = (statut) => {
    if (!statut) return "En attente";
    const s = statut.toLowerCase().trim();

    if (s.includes("attente")) return "En attente";
    if (s.includes("cours")) return "En cours";
    if (s.includes("term")) return "Terminé";
    if (s.includes("refus") || s.includes("rejet")) return "Refusé";
    return statut; // Retourne le statut original si non reconnu
  };

  const fetchDemandes = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://easyservice-backend-iv29.onrender.com/api/demandes",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      const allDemandes = response.data;
      setDemandes(allDemandes.length);

      // Initialiser le compteur avec tous les statuts possibles
      const counts = {
        "En attente": 0,
        "En cours": 0,
        Terminé: 0,
        Refusé: 0,
        Autre: 0, // Pour les statuts non reconnus
      };

      // Compter les demandes par statut normalisé
      allDemandes.forEach((demande) => {
        const normalizedStatut = normalizeStatut(demande.statut);
        if (counts[normalizedStatut] !== undefined) {
          counts[normalizedStatut]++;
        } else {
          counts["Autre"]++;
        }
      });

      // Mettre à jour l'état avec les données formatées pour le graphique
      setDemandesParStatut(
        Object.entries(counts)
          .filter(([statut]) => statut !== "Autre") // Exclure "Autre" si nécessaire
          .map(([statut, nombre]) => ({
            statut,
            nombre,
          }))
      );
    } catch (err) {
      console.error("Erreur fetchDemandes:", err);
      toast.error("Erreur lors du chargement des demandes");
    }
  }, []);

  const fetchServices = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://easyservice-backend-iv29.onrender.com/api/services/afficher/service",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // console.log(response.data.length);
      setServices(response.data.length);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTechniciens = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://easyservice-backend-iv29.onrender.com/api/auth/all/techniciens",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // console.log(response.data.techniciens.length);
      setTechniciens(response.data.techniciens.length);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAvis = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://easyservice-backend-iv29.onrender.com/api/avis",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // console.log(response.data.length);
      setAvis(response.data.length);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchDemandes(),
          fetchServices(),
          fetchTechniciens(),
          fetchAvis(),
        ]);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [fetchDemandes, fetchServices, fetchTechniciens, fetchAvis]);

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="p-4 lg:p-6 -ms-2 -mt-2">
          <h1 className="text-2xl font-bold mb-4">
            Tableau de Bord Administrateur
          </h1>

          {/* Statistiques */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6 animate-pulse">
            <div className="bg-blue-400 text-white p-4 rounded-lg text-center shadow-md flex flex-col justify-center items-center">
              <div className="h-[20px] w-[120px] bg-gray-200 mb-2"></div>
              <div className="h-[20px] w-[30px] bg-gray-200"></div>
            </div>
            <div className="bg-yellow-400 text-white p-4 rounded-lg text-center shadow-md flex flex-col justify-center items-center">
              <div className="h-[20px] w-[120px] bg-gray-200 mb-2"></div>
              <div className="h-[20px] w-[30px] bg-gray-200"></div>
            </div>
            <div className="bg-orange-400 text-white p-4 rounded-lg text-center shadow-md flex flex-col justify-center items-center">
              <div className="h-[20px] w-[120px] bg-gray-200 mb-2"></div>
              <div className="h-[20px] w-[30px] bg-gray-200"></div>
            </div>
            <div className="bg-green-400 text-white p-4 rounded-lg text-center shadow-md flex flex-col justify-center items-center">
              <div className="h-[20px] w-[120px] bg-gray-200 mb-2"></div>
              <div className="h-[20px] w-[30px] bg-gray-200"></div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 lg:gap-5">
            {/* Graphique : Nombre de demandes par statut */}
            <div className="bg-white p-2 lg:p-4 rounded-lg shadow-md w-full md:w-1/2">
              <div className="w-[250px] h-[20px] bg-gray-300 mb-2"></div>
              <div className="h-[300px] w-full bg-gray-200"></div>
            </div>

            {/* Graphique : Évolution des demandes */}
            <div className="bg-white p-2 lg:p-4 rounded-lg shadow-md w-full md:w-1/2">
              <div className="w-[250px] h-[20px] bg-gray-300 mb-2"></div>
              <div className="h-[300px] w-full bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 lg:p-6 -ms-2 -mt-2">
        <h1 className="text-2xl font-bold mb-4">
          Tableau de Bord Administrateur
        </h1>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-5 mb-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Services</h2>
            <p className="text-3xl font-bold">{services}</p>
          </div>
          <div className="bg-yellow-500 text-white p-4 rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Demandes</h2>
            <p className="text-3xl font-bold">{demandes}</p>
          </div>
          <div className="bg-orange-500 text-white p-4 rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Techniciens</h2>
            <p className="text-3xl font-bold">{techniciens}</p>
          </div>
          <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow-md">
            <h2 className="text-lg font-semibold">Avis</h2>
            <p className="text-3xl font-bold">{avis}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-3 lg:gap-5">
          {/* Graphique : Nombre de demandes par statut */}
          <div className="bg-white p-2 lg:p-4 rounded-lg shadow-md w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Demandes par Statut</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={demandesParStatut} barSize={50}>
                <XAxis dataKey="statut" />
                <YAxis interval={1} />
                <Tooltip />
                <Bar dataKey="nombre" fill="#3182CE">
                  <LabelList
                    dataKey="nombre"
                    position="center"
                    fill="white"
                    fontSize={18}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Graphique : Évolution des demandes */}
          <div className="bg-white p-2 lg:p-4 rounded-lg shadow-md w-full md:w-1/2">
            <h2 className="text-xl font-bold mb-4">Demandes (Par Semaines)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={evolutionDemandes}>
                <XAxis dataKey="semaine" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="demandes"
                  stroke="#38A169"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
