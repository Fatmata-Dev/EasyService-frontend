import { motion } from "framer-motion";
import { Link } from "react-scroll";

// Configuration d'animation réutilisable
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const slideInRight = {
  hidden: { opacity: 0, x: 100 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.8, ease: "anticipate" }
  }
};

export default function HeroSection() {
  return (
    <section id="home" className="bg-gray-50 p-4">
      <div className="md:px-12 flex flex-col items-center lg:flex-row">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.3 } }
          }}
          className="mx-auto px-4 text-center"
        >
          <motion.h1 
            variants={fadeInUp}
            className="text-4xl font-bold mb-6 text-gray-800"
          >
            Bienvenue sur <span className="text-orange-500">EasyService</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl mb-8 text-gray-600"
          >
            La plateforme idéale pour vos besoins en services techniques
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link
              to="services"
              smooth={true}
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full mb-6 lg:mb-0
                       hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Découvrir nos services
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 w-100 md:w-1/2"
        >
          <img 
            src="/mecano.jpg" 
            alt="Mécanicien" 
            className="h-full object-cover"
          />
          <div className="flex flex-col">
            <motion.img 
              src="/13430.jpg" 
              alt="Service client" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            />
            <motion.img 
              src="/dev.jpg" 
              alt="Développement" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            />
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="flex flex-col items-center sm:flex-row md:px-12 md:mx-12"
      >
        <div className="max-h-lg md:w-1/2">
          <img src="/femme.png" alt="Client recherchant un service" />
        </div>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl"
        >
          Vous êtes à la recherche d'experts pour un service
        </motion.p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -100px 0px" }}
        className="flex flex-col-reverse items-center sm:flex-row md:px-12 md:mx-12"
      >
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl"
        >
          Vous êtes un technicien à la recherche de clients
        </motion.p>
        <div className="max-h-lg w-3/5">
          <img src="/black man.png" alt="Technicien professionnel" />
        </div>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="text-xl font-bold sm:text-2xl md:text-3xl sm:mx-0 text-center mt-12 md:px-12 md:mx-12 mb-4"
      >
        <span className="text-orange-500">Easy Service</span> est la
        plateforme qu’il vous faut, alors n’hésitez pas car chez nous{" "}
        <span className="text-orange-500">la satisfaction est garantie</span>.
      </motion.p>
    </section>
  );
}






// import React from "react";
// import { Link } from "react-scroll";

// export default function HeroSection() {
//   return (
//     <section id="home" className="bg-gray-50 p-4 ">
//         <div className="md:px-12 flex flex-col items-center lg:flex-row">
//           <div className="mx-auto px-4 text-center">
//             <h1 className="text-4xl font-bold mb-6 text-gray-800">
//               Bienvenue sur <span className="text-orange-500">EasyService</span>
//             </h1>
//             <p className="text-xl mb-8 text-gray-600">
//               La plateforme idéale pour vos besoins en services techniques
//             </p>
//             <Link
//               to="services"
//               smooth={true}
//               className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full mb-6 lg:mb-0
//                     hover:bg-orange-600 transition-colors cursor-pointer"
//             >
//               Découvrir nos services
//             </Link>
//           </div>
//           <div className="grid grid-cols-2 w-100 md:w-1/2">
//             <img src="/mecano.jpg" alt="" style={{ height: "100%" }} />
//             <div className="flex flex-col">
//               <img src="/13430.jpg" alt="" />
//               <img src="/dev.jpg" alt="" />
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-col items-center sm:flex-row md:px-12 md:mx-12">
//           <div className="max-h-lg md:w-1/2">
//             <img src="/femme.png" alt="" />
//           </div>
//           <p className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl">
//             Vous êtes à la recherche d'experts pour un service
//           </p>
//         </div>
//         <div className="flex flex-col-reverse items-center sm:flex-row md:px-12 md:mx-12">
//           <p className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl">
//             Vous êtes un technicien à la recherche de clients
//           </p>
//           <div className="max-h-lg w-3/5">
//             <img src="/black man.png" alt="" />
//           </div>
//         </div>

//         <p className="text-xl font-bold sm:text-2xl md:text-3xl sm:mx-0 text-center mt-12 md:px-12 md:mx-12 mb-4">
//           <span className="text-orange-500">Easy Service</span> est la
//           plateforme qu’il vous faut, alors n’hésitez pas car chez nous{" "}
//           <span className="text-orange-500">la satisfaction est garantie</span>.
//         </p>
//     </section>
//   );
// }
