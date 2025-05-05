import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:4000/api",
    prepareHeaders: (headers, { endpoint }) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);

      // Ne pas définir Content-Type pour les uploads de fichiers
      if (!["updateUserProfile"].includes(endpoint)) {
        headers.set("Content-Type", "application/json");
      }

      return headers;
    },
  }),
  tagTypes: ["User", "Technicien"],
  endpoints: (builder) => ({
    // Endpoints pour les users
    getUsers: builder.query({
      query: () => "/auth/users",
      providesTags: ["User"],
      transformResponse: (response) =>
        response.users.map((user) => ({
          ...user || console.log(user),
        })),
    }),

    getUserConneted: builder.query({
      query: () => "/auth/users/me",
      providesTags: ["User"],
      transformResponse: (response) => response.user,
    }),

    getUserById: builder.query({
      query: (id) => `/auth/users/${id}`,
      providesTags: (result, error, id) => [{ type: "user", id }],
    }),

    userRegister: builder.mutation({
      query: (formData) => ({
        url: "/auth/register",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    userLogin: builder.mutation({
      query: (formData) => ({
        url: "/auth/login",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserProfile: builder.mutation({
      query: ({ id, body }) => ({
        url: `/auth/users/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, body }) => ({
        url: `/auth/users/${id}/change-role`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Technicien"],
    }),

    createTechnicien: builder.mutation({
      query: ( body ) => ({
        url: `/auth/creer/technicien`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Technicien"],
    }),

    getTechniciens: builder.query({
      query: () => "/auth/all/techniciens",
      providesTags: ["User", "Technicien"],
      transformResponse: (response) =>
        response.techniciens.map((user) => ({
          ...user || console.log(user),
        })),
    }),

    updateToTechnicien: builder.mutation({
      query: ({ id, body }) => ({
        url: `/auth/techniciens/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User", "Technicien"],
    }),

    // Endpoints pour les changements de mot de passe
    forgotPassword: builder.mutation({
      query: (body) => ({
        url: `/auth/forgot-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    resetPassword: builder.mutation({
      query: (body) => ({
        url: `/auth/reset-password`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    blockUser: builder.mutation({
      query: (id) => ({
        url: `/auth/users/${id}/block`,
        method: 'PUT',
      }),
      invalidatesTags: ['User']
    }),
    
    unblockUser: builder.mutation({
      query: (id) => ({
        url: `/auth/users/${id}/unblock`,
        method: 'PUT',
      }),
      invalidatesTags: ['User']
    }),

  }),
});

export const {
  useGetUsersQuery,
  useGetUserConnetedQuery,
  useGetUserByIdQuery,
  useUserRegisterMutation,
  useUserLoginMutation,
  useUpdateUserProfileMutation,
  useUpdateUserRoleMutation,
  useCreateTechnicienMutation,
  useGetTechniciensQuery,
  useUpdateToTechnicienMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useBlockUserMutation,
  useUnblockUserMutation
} = authApi;
