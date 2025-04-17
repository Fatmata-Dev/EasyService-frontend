import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../../components/Admin/SidebarAdmin';
import Header from '../../components/Header/Header';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
// import axios from 'axios';

const AdminHome = () => {
  const [admin, setAdmin] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const message = localStorage.getItem('message');

  if(message) {
    // toast.success(<h3 className='font-bold'>{message}</h3>, {duration:5000});
    toast.success(message, {duration:5000});
    localStorage.removeItem('message');
  }

  // Mock admin data
  useEffect(() => {
    setAdmin({
      name: "Mouhamed Ndiaye",
      email: "mouhamed@gmail.com"
    });
    // À remplacer par :
    // axios.get('/api/admins/me').then(res => setadmin(res.data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (!admin) return <div className="text-center p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={admin} />
      <div className="md:ml-[220px] bg-transparent relative">
        <SidebarAdmin />
        <div className={`${isScrolled ? 'h-full' : 'h-screen'} -mt-[65px] pt-[65px]`}>
          <main className="p-4 md:rounded-tl-xl md:border-t border-l bg-white h-full">
            <Outlet context={{ admin }} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;