// import React from 'react';


// const Navbar = () => {
//     return (
//     <nav
//         id="Navbar"
//         className="bg-white relative top-0 w-full m-0 p-0 z-50 transition-all duration-300"
//       >
//         <div className="mx-2 sm:mx-4 lg:mx-12 py-0 flex items-center justify-between">
//           {/* Logo décalé à gauche */}
//           <div className="flex cursor-pointer top-0 left-0 m-4">
//             {/* Icone menu hamburger */}
//             <FiMenu className="text-3xl lg:hidden" />{" "}
//             {/* Augmentez mr-8 pour plus d'espace */}
//             <Link
//               to="home"
//               spy={true}
//               smooth={true}
//               className="flex items-center hover:opacity-80 transition-opacity hidden lg:flex"
//             >
//               <img src={logo} alt="Easy Service Logo" className="h-12 w-32" />
//             </Link>
//           </div>

//           {/* Liens centrés */}
//           <div className="mx-auto flex justify-center hidden lg:flex">
//             <div className="flex items-center border-2 border-orange-500 rounded-full px-6 py-1 ml-8">
//               <Link
//                 to="home"
//                 spy={true}
//                 smooth={true}
//                 activeClass="bg-orange-500 text-white"
//                 className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
//                         hover:bg-orange-500 hover:text-white transition-colors"
//               >
//                 Accueil
//               </Link>
//               <Link
//                 to="services"
//                 spy={true}
//                 smooth={true}
//                 activeClass="bg-orange-500 text-white"
//                 className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
//               hover:bg-orange-500 hover:text-white transition-colors"
//               >
//                 Services
//               </Link>
//               <Link
//                 to="testimonials"
//                 spy={true}
//                 smooth={true}
//                 activeClass="bg-orange-500 text-white"
//                 className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
//               hover:bg-orange-500 hover:text-white transition-colors"
//               >
//                 Témoignages
//               </Link>
//               <Link
//                 to="contact"
//                 spy={true}
//                 smooth={true}
//                 activeClass="bg-orange-500 text-white"
//                 className="text-gray-800 cursor-pointer px-4 py-2 rounded-full 
//               hover:bg-orange-500 hover:text-white transition-colors"
//               >
//                 Contact
//               </Link>
//             </div>
//           </div>

//           {/* Boutons décalés à droite */}
//           <div className="flex space-x-4 ml-auto">
//             {" "}
//             {/* ml-auto pousse vers la droite */}
//             <button
//               onClick={() => setShowSignup(true)}
//               className="bg-white text-orange-500 px-2 py-1 sm:px-6 sm:py-2 rounded 
//               border-2 border-orange-500 hover:bg-orange-500 
//               hover:text-white transition-colors duration-300"
//             >
//               Inscription
//             </button>
//             <button
//               onClick={() => setShowLogin(true)}
//               className="bg-white text-orange-500 px-2 py-1 sm:px-6 sm:py-2 rounded
//               border-2 border-orange-500 hover:bg-orange-500 
//               hover:text-white transition-colors duration-300
              
//               "
//             >
//               Connexion
//             </button>
//           </div>
//         </div>
//       </nav>

// );
// };

// export default Navbar; 