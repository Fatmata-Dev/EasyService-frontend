import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import { useState, useEffect } from "react";
import { useGetUserConnetedQuery } from "../API/authApi";
import Sidebar from "../components/navigation/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";

const UsersHome = () => {
const { data: user, isloading } = useGetUserConnetedQuery();
const [isScrolled, setIsScrolled] = useState(false);
const message = localStorage.getItem('message');
      
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

    
    if(user && localStorage.getItem('mess')) {
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
      
        localStorage.removeItem('mess');
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };

    
    
  }, [ message, user]);
  

//   if (!token) return navigate("/", { replace: true });
  if (!user) return <div className="text-center p-8 w-full">Vous n'êtes pas connecté</div>;
  if (isloading) return <div className="flex justify-center items-center h-screen w-full"><LoadingSpinner /></div>;

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