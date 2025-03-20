import { Link } from "react-router-dom";
import { FaLongArrowAltRight } from "react-icons/fa";

const data = [
  {
    id: 1,
    name: "Maintenance Informatique",
    categorie: "Informatique",
    tarif: "12.000 F",
    date_soumission: "20/03/2025",
    date_intervention: "21/03/2025",
    status: "En cours",
  },
  {
    id: 2,
    name: "Tresse",
    categorie: "Coiffure",
    tarif: "2.000 F",
    date_soumission: "20/03/2025",
    date_intervention: "23/03/2025",
    status: "En attente",
  },
];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-gray-100 rounded-lg">
        <h3 className="uppercase text-center font-bold text-lg mt-2">
          Demandes
        </h3>

        <div className="container mx-auto p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 bg-white rounded-lg shadow-md">
              <thead className="bg-orange-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Nom</th>
                  <th className="px-6 py-3 text-left">Categorie</th>
                  <th className="px-6 py-3 text-left">Tarif</th>
                  <th className="px-6 py-3 text-left">Date de soumission</th>
                  <th className="px-6 py-3 text-left">Date intervention</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr
                    key={user.id}
                    className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                  >
                    <td className="px-6 py-3 border-b">{user.name}</td>
                    <td className="px-6 py-3 border-b">{user.categorie}</td>
                    <td className="px-6 py-3 border-b">{user.tarif}</td>
                    <td className="px-6 py-3 border-b">
                      {user.date_soumission}
                    </td>
                    <td className="px-6 py-3 border-b">
                      {user.date_intervention}
                    </td>
                    <td className="px-6 py-3 border-b">{user.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end items-center">
            <Link
              to="home"
              className="text-orange-500 cursor-pointer font-bold flex items-center gap-2"
            >
              Voir toutes les demandes{" "}
              <FaLongArrowAltRight className="text-xl" />
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-100 rounded-lg">
        <h3 className="uppercase text-center font-bold text-lg mt-2">
          Messages
        </h3>
        <div className="flex">
          <h4 className="text-4xl px-3 py-1 bg-orange-400 rounded-full m-2 flex justify-center items-center">A</h4>
          <div className="flex flex-col gap-2">
            <p>Admin Fadiaba</p>
            <p>Bonjour Mouhamed, votre demande a était acceptée</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
