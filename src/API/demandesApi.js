import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const demandesApi = createApi({
  reducerPath: "demandesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);

      // Ne pas définir Content-Type pour les uploads de fichiers
      if (!["createDemande", "updateDemande"].includes(endpoint)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["Demande", "DemandeStatut", "Facture"],
  endpoints: (builder) => ({
    // Endpoints pour les demandes
    getDemandes: builder.query({
      query: () => "/demandes",
      providesTags: ["Demande"],
      transformResponse: (response) =>
        response.map((demande) => ({
          ...demande
        })),
    }),

    getDemandeById: builder.query({
      query: (id) => `/demandes/${id}`,
      providesTags: (result, error, id) => [{ type: "Demande", id }],
      transformResponse: (response) => response,
    }),

    createDemande: builder.mutation({
      query: (formData) => ({
        url: "/demandes",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Demande"],
    }),

    updateDemande: builder.mutation({
      query: ({ id, body }) => ({
        url: `/demandes/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Demande"],
    }),

    deleteDemande: builder.mutation({
      query: (id) => ({
        url: `/demandes/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Demande"],
    }),

    // Endpoints pour les catégories
    commencerDemande: builder.mutation({
      query: ({id, body}) => ({
        url: `/demandes/commencer/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DemandeStatut"],
    }),

    terminerDemande: builder.mutation({
      query: ({id, body}) => ({
        url: `/demandes/terminer/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["DemandeStatut"],
    }),

    getDemandeForClientId: builder.query({
      query: (id) => `/demandes/client/${id}`,
      providesTags: (result, error, id) => [{ type: "demande", id }],
    }),

    getDemandeForTechnicienId: builder.query({
      query: (id) => `/demandes/technicien/${id}`,
      providesTags: (result, error, id) => [{ type: "demande", id }],
    }),

    assignerDemande: builder.mutation({
      query: (body) => ({
        url: `/demandes/assigner`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Demande"],
    }),

    // Endpoints pour les factures
    getFactures: builder.query({
      query: () => "/factures/afficher/facture",
      providesTags: ["Facture"],
    }),

    getFactureById: builder.query({
      query: (id) => `/factures/afficher/facture/${id}`,
      providesTags: (result, error, id) => [{ type: "Facture", id }],
    }),

    createFacture: builder.mutation({
      query: (formData) => ({
        url: "/factures/creer/facture",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Facture"],
    }),

    updateFacture: builder.mutation({
      query: ({ id, body }) => ({
        url: `/factures/modifier/facture/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Facture"],
    }),

    deleteFacture: builder.mutation({
      query: (id) => ({
        url: `/factures/supprimer/facture/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Facture"],
    }),

    // downloadFacture: builder.query({
    //   query: (id) => ({
    //     url: `/factures/${id}/download`,
    //     responseHandler: async (response) => {
    //       const blob = await response.blob();
    //       return {
    //         data: blob,
    //         meta: {
    //           responseHeaders: {
    //             'content-disposition': response.headers.get('content-disposition'),
    //             'content-type': response.headers.get('content-type')
    //           }
    //         }
    //       };
    //     }
    //   }),
    //   providesTags: (result, error, id) => [{ type: "Facture", id }],
    // }),

    // Ajoutez cette mutation pour le téléchargement
    downloadFacture: builder.mutation({
      query: (id) => ({
        url: `/factures/${id}/download`,
        method: 'GET',
        responseHandler: async (response) => {
          // Retourner seulement les métadonnées nécessaires
          return {
            headers: {
              'content-disposition': response.headers.get('content-disposition'),
              'content-type': response.headers.get('content-type')
            }
          };
        },
        cache: 'no-cache'
      }),
    }),
  }),
});

export const {
  useGetDemandesQuery,
  useGetDemandeByIdQuery,
  useCreateDemandeMutation,
  useUpdateDemandeMutation,
  useDeleteDemandeMutation,
  useCommencerDemandeMutation,
  useTerminerDemandeMutation,
  useGetDemandeForClientIdQuery,
  useGetDemandeForTechnicienIdQuery,
  useAssignerDemandeMutation,
  useGetFacturesQuery,
  useGetFactureByIdQuery,
  useCreateFactureMutation,
  useUpdateFactureMutation,
  useDeleteFactureMutation,
  useDownloadFactureQuery,
  useDownloadFactureMutation
} = demandesApi;
