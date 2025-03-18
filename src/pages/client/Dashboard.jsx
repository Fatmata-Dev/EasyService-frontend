import { Outlet } from 'react-router-dom';
import Sidebar from '../../components/client/Sidebar';
import Header from '../../components/client/Header';
import { useState, useEffect } from 'react';
// import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  // Mock user data
  useEffect(() => {
    setUser({
      name: "Mouhamed Ndiaye",
      email: "mouhamed@gmail.com"
    });
    // À remplacer par :
    // axios.get('/api/users/me').then(res => setUser(res.data));
  }, []);

  if (!user) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header user={user} />
        <main className="p-8">
          <Outlet context={{ user }} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;