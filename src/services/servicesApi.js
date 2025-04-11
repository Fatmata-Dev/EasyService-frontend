import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { getState, endpoint }) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);

      // Ne pas définir Content-Type pour les uploads de fichiers
      if (!["createService", "updateService"].includes(endpoint)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["Service", "Category"],
  endpoints: (builder) => ({
    // Endpoints pour les services
    getServices: builder.query({
      query: () => "/services/afficher/service",
      providesTags: ["Service"],
      transformResponse: (response) =>
        response.map((service) => ({
          ...service,
          categorie: service.categorie || {},
        })),
    }),

    getServiceById: builder.query({
      query: (id) => `/services/${id}`,
      providesTags: (result, error, id) => [{ type: "Service", id }],
    }),

    createService: builder.mutation({
      query: (formData) => ({
        url: "/services/ajouter/service",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Service"],
    }),

    updateService: builder.mutation({
      query: ({ id, body }) => ({
        url: `/services/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Service"],
    }),

    deleteService: builder.mutation({
      query: (id) => ({
        url: `/services/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Service"],
    }),

    // Endpoints pour les catégories
    getCategories: builder.query({
      query: () => "/categories/all/categories",
      providesTags: ["Category"],
      transformResponse: (response) => response,
    }),

    createCategory: builder.mutation({
      query: (newCategory) => ({
        url: "/categories/ajouter/categorie",
        method: "POST",
        body: newCategory ,
      }),
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetServicesQuery,
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
} = servicesApi;
