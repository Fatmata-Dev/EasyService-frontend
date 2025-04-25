export default function DetailsMessageClient (selectedMessage, messages, formatDate) {
    return (
        <div className="lg:col-span-2 pl-0 lg:pl-6">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-gray-200 rounded-lg p-6 h-full flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center">
                    {selectedMessage.expediteur?.photo ? (
                      <img
                        src={selectedMessage.expediteur.photo}
                        alt={selectedMessage.expediteur.prenom}
                        className="w-12 h-12 rounded-full mr-4 object-cover"
                      />
                    ) : (
                      <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {selectedMessage.expediteur?.prenom || "Admin"}{" "}
                        {selectedMessage.expediteur?.nom || ""}
                      </h2>
                      <p className="text-gray-600">
                        {selectedMessage.expediteur?.email ||
                          "support@easyservice.com"}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(selectedMessage.date)}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedMessage.titre}
                  </h3>
                  {selectedMessage.objet && (
                    <span className="inline-block px-2 py-1 mt-1 text-xs rounded-full bg-gray-100 text-gray-600">
                      {selectedMessage.objet}
                    </span>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-2 flex-grow">
                  <div className="prose max-w-none mb-6">
                    <p className="whitespace-pre-line text-gray-800">
                      {selectedMessage.contenu}
                    </p>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    {/* <button
                      onClick={() => setReplying(!replying)}
                      className="flex items-center text-orange-500 hover:text-orange-600"
                    >
                      <FaReply className="mr-2" />
                      Répondre
                    </button> */}

                    {selectedMessage.demande && (
                      <Link
                        to={`/client/demandes/${selectedMessage.demande}`}
                        className="text-sm text-blue-500 hover:underline"
                      >
                        Voir la demande associée
                      </Link>
                    )}
                  </div>

                  {/* <AnimatePresence>
                    {replying && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <textarea
                          className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
                          rows="4"
                          placeholder="Votre réponse..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                        />
                        <div className="flex justify-end mt-2 space-x-3">
                          <button
                            onClick={() => setReplying(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={handleReply}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                          >
                            Envoyer
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence> */}
                </div>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 rounded-lg p-8">
                <FaEnvelopeOpen className="text-5xl text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  Aucun message sélectionné
                </h3>
                <p className="text-gray-400 text-center">
                  {messages.length === 0
                    ? "Vous n'avez aucun message"
                    : "Cliquez sur un message dans la liste pour en voir le contenu"}
                </p>
              </div>
            )}
          </div>
    );
}