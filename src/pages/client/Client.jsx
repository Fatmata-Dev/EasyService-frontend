import { Outlet } from "react-router-dom";
import Sidebar from "../../components/client/Sidebar";
import Header from "../../components/Header/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import axios from 'axios';

const ClientHome = () => {
  const [user, setUser] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const token = localStorage.getItem("authToken");

  const navigate = useNavigate();

  // Mock user data
  useEffect(() => {
    setUser({
      name: "Mouhamed Ndiaye",
      email: "mouhamed@gmail.com",
    });
    // À remplacer par :
    // axios.get('/api/users/me').then(res => setUser(res.data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!user) return <div className="text-center p-8">Chargement...</div>;
  if (!token) return navigate("/", { replace: true });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="md:ml-[220px] bg-transparent relative">
        <Sidebar />
        <div
          className={`${
            isScrolled ? "h-full" : "h-screen"
          } -mt-[65px] pt-[65px]`}
        >
          <main className="p-4 md:rounded-tl-xl md:border-t border-l bg-white h-full">
            <Outlet context={{ user }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default ClientHome;