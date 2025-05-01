import { Outlet } from "react-router-dom";
// import Sidebar from "../components/client/Sidebar";
// import SidebarAdmin from "../components/Admin/SidebarAdmin";
// import SidebarTechnicien from "../components/Technicien/SidebarTechnicien";
import Header from "../components/Header/Header";
import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useGetUserConnetedQuery } from "../API/authApi";
// import axios from 'axios';
import Sidebar from "../components/navigation/Sidebar";

const UsersHome = () => {
const { data: user, isloading } = useGetUserConnetedQuery();
const [isScrolled, setIsScrolled] = useState(false);
const [messageShown, setMessageShown] = useState(false);
const message = localStorage.getItem('message');
// const navigate = useNavigate();
const RoleBasedSidebar = ({ role }) => {
  if (role === "admin") return <SidebarAdmin user={user} />;
  if (role === "technicien") return <SidebarTechnicien user={user} />;
    return <Sidebar user={user} />; // client par défaut
  };
      
//   console.log(user);

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    
    const message = localStorage.getItem('message');

    if (message && user && !messageShown) {
        toast.success(
          <span>
            <p>
              Bienvenu(e)
              <strong className='font-bold capitalize'>{" "}{user?.prenom} {user?.nom}</strong>, vous êtes connecté en tant que
              <strong className='font-bold capitalize'>{" "}{user?.role}</strong>
            </p>
          </span>,
          { duration: 5000 }
        );
        localStorage.removeItem('message');
        setMessageShown(true);
      }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
    
  }, [ message, user, messageShown ]);
  

//   if (!token) return navigate("/", { replace: true });
  if (!user) return <div className="text-center p-8">Vous n'êtes pas connecté</div>;
  if (isloading) return <div className="text-center p-8">Chargement...</div>;

return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      <div className="md:ml-[220px] bg-transparent relative">
        <Sidebar user={user} />
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

export default UsersHome;