// src/components/sections/TestimonialsSection.jsx
import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import TestimonialCard from "../cards/TestimonialCard";

const testimonials = [
  {
    id: 1,
    image: "testimonial.png",
    name: "Floyd Miles",
    text: "Service exceptionnel et professionnel. Intervention rapide et tarifs très raisonnables.",
    rating: 5,
  },
  {
    id: 2,
    image: "t2.png",
    name: "Ronald Richards",
    text: "Techniciens compétents et matériel de qualité. Je recommande !",
    rating: 4,
  },
  {
    id: 3,
    image: "t3.png",
    name: "Abdoulaye Laye",
    text: "Techniciens compétents et matériel de qualité. Je recommande !",
    rating: 4,
  },
  {
    id: 4,
    image: "t2.png",
    name: "Savannah Nguyen",
    text: "Service rapide et efficace, je suis très satisfait des résultats obtenus.",
    rating: 5,
  },
];

export default function TestimonialSection() {
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // useEffect commenté mais conservé pour référence future
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       await new Promise(resolve => setTimeout(resolve, 1000));
  //       setTestimonials(mockData);
  //     } catch (err) {
  //       setError("Erreur de chargement des témoignages");
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const getVisibleTestimonials = () => {
    return [
      testimonials[currentIndex],
      testimonials[(currentIndex + 1) % testimonials.length],
      testimonials[(currentIndex + 2) % testimonials.length],
    ];
  };

  // if (loading) return <div>Chargement...</div>;
  // if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div id="testimonials">
      <h2 className="bg-[#2C3E50] text-3xl md:text-4xl font-bold text-center p-2 my-8 text-gray-100 uppercase">
        Testimonials
      </h2>
      <section
       
        className="bg-gray-50 relative overflow-hidden"
      >
        <div className="container mx-auto pb-12">
 
          <h4 className="text-lg text-center mb-4 mt-0">

            Nous sommes fiers de vous témoigner de la fiabilité de nos service
            et de l'efficacité de nos techniciens
          </h4>

          {/* Carrousel avec 3 témoignages visibles */}
          <div className="relative group mx-4 md:mx-16">
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all transform -translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
            >
              <FiChevronLeft size={24} />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-orange-500 hover:text-white transition-all transform translate-x-4 group-hover:translate-x-0 opacity-0 group-hover:opacity-100"
            >
              <FiChevronRight size={24} />
            </button>

            <div className="overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out">
                {getVisibleTestimonials().map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4 transform transition-opacity duration-300"
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Indicateurs de position améliorés */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-orange-500 w-6" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Ancienne version grid conservée mais commentée */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div> */}
        </div>
      </section>
    </div>
  );
}
