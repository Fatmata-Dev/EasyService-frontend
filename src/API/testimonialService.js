// src/services/testimonialService.js
export const fetchTestimonials = async () => {
    // À remplacer plus tard par :
    // return await axios.get(process.env.REACT_APP_API_URL + '/testimonials');

    
// ???    // À remplacer par l'appel API réel
//     const apiUrl = process.env.REACT_APP_ENV === 'development'
//   ? 'http://localhost:3000/api' // Dev
//   : 'https://api.easy-service.com'; // Prod



    // Mock temporaire
    return [
      {
        name: "Floyd Miles",
        text: "Service exceptionnel...",
        rating: 5
      }
    ];
  };