import React from "react";
import { Link } from "react-scroll";

export default function HeroSection() {
  return (
    <section id="home" className="bg-gray-50">
      <div className="my-4 py-4 md:my-12 md:px-12 flex flex-col items-center lg:flex-row">
        <div className="mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6 text-gray-800">
            Bienvenue sur <span className="text-orange-500">EasyService</span>
          </h1>
          <p className="text-xl mb-8 text-gray-600">
            La plateforme idéale pour vos besoins en services techniques
          </p>
          <Link
            to="services"
            smooth={true}
            className="inline-block bg-orange-500 text-white px-8 py-3 rounded-full mb-6 lg:mb-0
                    hover:bg-orange-600 transition-colors cursor-pointer"
          >
            Découvrir nos services
          </Link>
        </div>
        <div className="grid grid-cols-2 w-100 md:w-1/2">
          <img src="/public/mecano.jpg" alt="" style={{ height: "100%" }} />
          <div className="flex flex-col">
            <img src="/public/13430.jpg" alt="" />
            <img src="/public/dev.jpg" alt="" />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center sm:flex-row md:px-12 md:mx-12">
        <div className="max-h-lg md:w-1/2">
          <img src="/public/femme.png" alt="" />
        </div>
        <p className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl">
        Vous êtes à la recherche d'experts pour un service 
        </p>
      </div>
      <div className="flex flex-col-reverse items-center sm:flex-row md:px-12 md:mx-12">
        
        <p className="text-xl text-center sm:text-left font-bold md:w-1/2 md:text-3xl">
        Vous êtes un technicien à la recherche de clients 
        </p><div className="max-h-lg w-3/5">
          <img src="/public/black man.png" alt="" />
        </div>
      </div>

      <p className="text-xl font-bold sm:text-2xl md:text-3xl sm:mx-0 text-center mt-12 md:px-12 md:mx-12">
      <span className="text-orange-500">Easy Service</span> est la plateforme qu’il vous faut, alors n’hésitez pas car chez nous <span className="text-orange-500">la satisfaction est garantie</span>.
      </p>
    </section>
  );
}
