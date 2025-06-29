import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const messagesApi = createApi({
  reducerPath: "messagesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_Backend_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Message"],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => "/messages",
      providesTags: ["Message"],
    }),

    getMessageById: builder.query({
      query: (id) => `/messages/${id}`,
      providesTags: (result, error, id) => [{ type: "Message", id }],
      transformResponse: (response) => response.data,
    }),

    getSentMessages: builder.query({
      query: () => "/messages/envoyes",
      providesTags: ["Message"],
    }),

    getReceivedMessages: builder.query({
      query: () => "/messages/recus",
      providesTags: ["Message"],
    }),

    createMessage: builder.mutation({
      query: (message) => ({
        url: "/messages",
        method: "POST",
        body: message,
      }),
      invalidatesTags: ["Message"],
    }),

    deleteMessage: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Message"],
    }),

    markAsRead: builder.mutation({
      query: (id) => ({
        url: `/messages/${id}/lu`,
        method: "PUT",
      }),
      invalidatesTags: ["Message"],
    }),

    getUnreadMessages: builder.query({
      query: () => `/messages/non-lus/count`,
      providesTags: ["Message"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetMessagesQuery,
  useGetMessageByIdQuery,
  useGetSentMessagesQuery,
  useGetReceivedMessagesQuery,
  useCreateMessageMutation,
  useDeleteMessageMutation,
  useMarkAsReadMutation,
  useGetUnreadMessagesQuery
} = messagesApi;