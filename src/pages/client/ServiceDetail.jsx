import React from "react";

const ServiceDetail = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-center">DETAIL DU SERVICE</h1>

      <div className="flex gap-3">
        <img src="/plomberie.jpg" alt="" className="w-1/2" />
        <div className="flex flex-col w-1/2">

      <h2 className="text-xl font-semibold mb-2 text-orange-500">MAINTENANCE RÉSEAU</h2>
      <p className="text-gray-700 mb-4">INFORMATIQUE</p>

      <p className="mb-4">
        Le technicien sera chargé de faire les installations pour le réseau. Une
        fois les installations faites, il y aura un suivi et évaluation par le
        technicien afin de valider la fiabilité de son travail.
      </p>

      <div className="mb-4">
        <p>
          <strong>TARIF :</strong> 10.000 FCFA / Jours
        </p>
        <p>
          <strong>DUREE :</strong> 2 Heures
        </p>
        <p>
          <strong>DATE INTERVENTION :</strong> Vendredi 14 Mars 2025
        </p>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Ajouté le 11/03/2025 par Admin FADIABA
      </p></div>
      </div>

      <hr className="mb-6" />

      <h3 className="text-xl font-semibold mb-4">PROFIL</h3>
      <p className="mb-4">
        Ce travail est fait pour les profils et ceux qui remplissent ces
        pré-requis :
      </p>

      <div className="mb-4">
        <p>
          <strong>Profil :</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>Métier informatique</li>
          <li>Métier administrateur réseaux</li>
        </ul>
      </div>

      <div className="mb-6">
        <p>
          <strong>Pré-requis :</strong>
        </p>
        <ul className="list-disc list-inside">
          <li>Avoir au moins 2 ans d'expériences</li>
          <li>Savoir travailler en groupe</li>
        </ul>
      </div>

      {/* <div className="flex space-x-4">
        <button className="bg-red-500 text-white px-4 py-2 rounded-md">
          Supprimer
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Modifier
        </button>
      </div> */}
    </div>
  );
};

export default ServiceDetail;
