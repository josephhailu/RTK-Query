import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/fakeApi" }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => "/posts",
      providesTags: ["Post"],
    }),
    deletePost: builder.mutation({
      query: (post) => ({
        url: `/posts/${post.id}`,
        method: "DELETE",
        body: post,
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const { useGetPostsQuery, useLazyGetPostsQuery, useDeletePostMutation } =
  apiSlice;
