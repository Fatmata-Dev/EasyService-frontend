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

export default function DashboardAdmin() {
  // Données factices (en attendant l'API)
  const [stats, setStats] = useState({
    totalServices: 15,
    demandesEnCours: 28,
    totalTechniciens: 30,
    totalAvis: 25,
  });

  const demandesParStatut = [
    { statut: "En attente", nombre: 5 },
    { statut: "En cours", nombre: 8 },
    { statut: "Terminé", nombre: 12 },
    { statut: "Refusé", nombre: 3 },
  ];

  const evolutionDemandes = [
    { semaine: "S1", demandes: 4 },
    { semaine: "S2", demandes: 6 },
    { semaine: "S3", demandes: 10 },
    { semaine: "S4", demandes: 7 },
  ];

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
              <p className="text-3xl font-bold">{stats.totalServices}</p>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg text-center shadow-md">
              <h2 className="text-lg font-semibold">Demandes</h2>
              <p className="text-3xl font-bold">{stats.demandesEnCours}</p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-lg text-center shadow-md">
              <h2 className="text-lg font-semibold">Techniciens</h2>
              <p className="text-3xl font-bold">{stats.totalTechniciens}</p>
            </div>
            <div className="bg-green-500 text-white p-4 rounded-lg text-center shadow-md">
              <h2 className="text-lg font-semibold">Avis</h2>
              <p className="text-3xl font-bold">{stats.totalAvis}</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 lg:gap-5">
            {/* Graphique : Nombre de demandes par statut */}
            <div className="bg-white p-2 lg:p-4 rounded-lg shadow-md w-full md:w-1/2">
              <h2 className="text-xl font-bold mb-4">Demandes par Statut</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={demandesParStatut} barSize={50}>
                  <XAxis dataKey="statut" />
                  <YAxis />
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
              <h2 className="text-xl font-bold mb-4">
                Demandes (Par Semaines)
              </h2>
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
