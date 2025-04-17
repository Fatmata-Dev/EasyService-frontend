import { useState } from "react";
import { toast } from "react-hot-toast";
import emailjs from "@emailjs/browser";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    nom: "",
    mail: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await emailjs.send(
        "service_tvzystp", // Remplacez par votre ID de service EmailJS
        "template_e0lcrrm", // Remplacez par votre ID de template
        formData,
        "yEo8HiDmt3WvVcAnf" // Remplacez par votre clé publique EmailJS
      );

      toast.success("Message envoyé avec succès !");
      setFormData({ nom: "", mail: "", subject: "", message: "" });
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de l'envoi du message");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="contact">
      {/* <h2 className="text-3xl md:text-4xl font-bold text-center p-2 text-gray-700 uppercase">
        Contact
      </h2> */}
      <h2 className="bg-[#2C3E50] text-3xl md:text-4xl font-bold text-center p-2 text-gray-100 uppercase">
        Contact
      </h2>
      <form onSubmit={handleSubmit} className="mx-4 md:mb-12">
        <div className="py-4 container max-w-xl mx-auto">
          <div className="bg-gray-100 py-4">
            <p className="mb-4 text-xl text-gray-600 text-center">
              Pour plus d&apos;informations sur notre entreprise et nos
              services, envoyez nous un message via ce formulaire
            </p>

            <div className="mx-12">
              {/* Champs du formulaire avec ajout de value et onChange */}
              <div className="mb-4">
                <label
                  htmlFor="nom"
                  className="block font-medium text-gray-900"
                >
                  Prénom et nom
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Votre prénom et nom"
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleChange}
                    required
                    className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="mail"
                  className="block font-medium text-gray-900"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Votre email"
                    id="mail"
                    name="mail"
                    type="email"
                    value={formData.mail}
                    onChange={handleChange}
                    required
                    className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="subjct"
                  className="block font-medium text-gray-900"
                >
                  subject
                </label>
                <div className="mt-2">
                  <input
                    placeholder="Votre sujet"
                    id="subject"
                    name="subject"
                    type="text"
                    // value={formData.subject}
                    onChange={handleChange}
                    className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="message"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Message
                </label>
                <div className="mt-2">
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Écrivez votre message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded bg-orange-500 mt-4 px-3 py-2 text-xl w-full font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700 disabled:opacity-50"
                >
                  {isLoading ? "Envoi en cours..." : "Envoyer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// import { useState } from 'react';
// // import axios from 'axios';

// export default function ContactSection() {
//   return (
//     <div id="contact">
//       <h2 className="text-3xl md:text-4xl font-bold text-center p-2 text-gray-700 uppercase">
//         Contact
//       </h2>
//       <form className="mx-4 md:mb-12">
//         <div className="py-4 container max-w-xl mx-auto">
//           <div className="bg-gray-100 py-4">
//             <p className="mb-4 text-xl text-gray-600 text-center">
//             Pour plus d&apos;informations sur notre entreprise et nos services, envoyez nous un message via ce formulaire
//             </p>

//             <div className="mx-12">
//               <div className="mb-4">
//                 <label
//                   htmlFor="nom"
//                   className="block font-medium text-gray-900"
//                 >
//                   Prénom et nom
//                 </label>
//                 <div className="mt-2">
//                   <input

//                   placeholder="Votre prénom et nom"
//                     id="nom"
//                     name="nom"
//                     type="text"
//                     autoComplete="given-name"
//                     className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="mail"
//                   className="block font-medium text-gray-900"
//                 >
//                   Email
//                 </label>
//                 <div className="mt-2">
//                   <input

//                   placeholder="Votre email"
//                     id="mail"
//                     name="mail"
//                     type="mail"
//                     autoComplete="given-email"
//                     className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
//                   />
//                 </div>
//               </div>

//               <div className="mb-4">
//                 <label
//                   htmlFor="subject"
//                   className="block font-medium text-gray-900"
//                 >
//                   Téléphone
//                 </label>
//                 <div className="mt-2">
//                   <input

//                   placeholder="Votre numéro de téléphone"
//                     id="phone"
//                     name="phone"
//                     type="phone"
//                     autoComplete="phone"
//                     className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
//                   />
//                 </div>
//               </div>

//               <div className="col-span-full">
//               <label htmlFor="message" className="block text-sm/6 font-medium text-gray-900">
//                 Message
//               </label>
//               <div className="mt-2">
//                 <textarea
//                   id="message"
//                   name="message"
//                   rows={3}
//                   placeholder="Écrivez votre message"
//                   className="block w-full rounded bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 sm:text-sm/6"
//                   defaultValue={''}
//                 />
//               </div>
//             </div>

//               <div className="mt-6 flex items-center justify-end gap-x-6">
//                 <button
//                   type="submit"
//                   className="rounded bg-orange-500 mt-4 px-3 py-2 text-xl w-full font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
//                 >
//                   Envoyer
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </div>
//   );
// }




