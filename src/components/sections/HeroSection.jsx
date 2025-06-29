import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-scroll";
import { useState, useEffect } from "react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function HeroSection() {
  const backgroundImages = [
    "/10655425.webp",
    "/image1.jpeg",
    "/image10.jpeg",
    "/image2.jpeg",
    "/coiffeuse.png",
    "/image3.jpeg",
    "/image4.jpeg",
    "/image5.jpeg",
    "/depannage-chauffe-eau.jpg",
    "/image6.jpeg",
    "/image7.jpeg",
    "/illustration-developpeur-C.png",
    "/image8.jpeg",
    "/image9.jpeg",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        setIsTransitioning(false);
      }, 800); // Durée de la transition
    }, 5000); // Changement toutes les 5 secondes

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  return (
    <section id="home" className="bg-gray-50 p-4 relative overflow-hidden">
      {/* Conteneur principal avec fond animé */}
      <div className="relative h-dvh -m-4 mb-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${backgroundImages[currentIndex]})`,
              willChange: "opacity", // Optimisation pour les animations
            }}
          >
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Contenu superposé */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.2 } },
          }}
          className="absolute z-10 text-center absolute bottom-0 md:bottom-4 right-[50%] translate-x-[50%] w-full mb-1"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl font-bold text-white">
            Bienvenue sur <span className="text-orange-500">EasyService</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="text-xl mb-8 text-white">
            La plateforme idéale pour vos besoins en services techniques
          </motion.p>

          <motion.div variants={fadeInUp}>
            <Link
              to="services"
              smooth={true}
              duration={1000}
              offset={-75}
              className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full mb-6 lg:mb-0
                       hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              Découvrir nos services
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Sections suivantes (inchangées) */}
      <div className="flex flex-col items-center sm:flex-row md:px-12 md:mx-12">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-h-lg md:w-1/2"
        >
          <img src="/femme.png" alt="Client recherchant un service" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl"
        >
          Vous êtes à la recherche d'experts pour un service
        </motion.p>
      </div>

      {/* Section Technicien */}
      <div className="flex flex-col-reverse items-center sm:flex-row md:px-12 md:mx-12">
        <motion.p
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl"
        >
          Vous êtes un technicien à la recherche de clients
        </motion.p>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "0px 0px -100px 0px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-h-lg w-3/5"
        >
          <img src="/black man.png" alt="Technicien professionnel" />
        </motion.div>
      </div>

      {/* Section Conclusion */}
      <motion.p
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9 }}
        className="text-xl font-bold sm:text-2xl md:text-3xl sm:mx-0 text-center mt-12 md:px-12 md:mx-12 mb-4"
      >
        <motion.span className="text-orange-500">Easy Service</motion.span> est
        la plateforme qu’il vous faut, alors n’hésitez pas car chez nous{" "}
        <motion.span className="text-orange-500">
          la satisfaction est garantie
        </motion.span>
        .
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
