import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const searchApi = createApi({
  reducerPath: "searchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_Backend_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Search"],
  endpoints: (builder) => ({
    getSearch: builder.query({
      query: ({ query, email }) => `/search?q=${query}${email ? `&user=${email}` : ''}`,
      providesTags: ["Search"],
    }),
  }),
});

export const {
  useGetSearchQuery,
  useLazyGetSearchQuery, // Ajout de la version "lazy" de la query
} = searchApi;