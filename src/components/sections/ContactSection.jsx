export default function ContactSection() {
  return (
    <div id="contact">
      <h2 className="bg-[#2C3E50] text-3xl md:text-4xl font-bold text-center p-2 text-gray-100 uppercase">
        Contact
      </h2>
      <form className="mx-4 md:mb-12">
        <div className="py-4 container max-w-xl mx-auto">
          <div className="bg-gray-100 py-4">
            <p className="mb-4 text-xl text-gray-600 text-center">
            Pour plus d&apos;informations sur notre entreprise et nos services, envoyez nous un message via ce formulaire
            </p>

            <div className="mx-12">
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
                    autoComplete="given-name"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
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
                    type="mail"
                    autoComplete="given-email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block font-medium text-gray-900"
                >
                  Téléphone
                </label>
                <div className="mt-2">
                  <input
                  
                  placeholder="Votre numéro de téléphone"
                    id="phone"
                    name="phone"
                    type="phone"
                    autoComplete="phone"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-orange-500 sm:text-sm/6"
                  />
                </div>
              </div>

              <div className="col-span-full">
              <label htmlFor="message" className="block text-sm/6 font-medium text-gray-900">
                Message
              </label>
              <div className="mt-2">
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  placeholder="Écrivez votre message"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 border-2 outline-1 -outline-offset-1 outline-orange-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-orange-500 sm:text-sm/6"
                  defaultValue={''}
                />
              </div>
            </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                  type="submit"
                  className="rounded-md bg-orange-500 mt-4 px-3 py-2 text-xl w-full font-semibold text-white shadow-xs hover:bg-orange-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-700"
                >
                  Envoyer
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
