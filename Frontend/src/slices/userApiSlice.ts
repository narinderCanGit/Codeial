import { apiSlice } from './apiSlice';
import { USERS_URL } from '../constants';

interface AuthPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<{ token: string; user: { id: string; name: string; email: string } }, AuthPayload>({
      query: (data) => ({
        url: `${USERS_URL}/sign-in`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation<{ token: string; user: { id: string; name: string; email: string } }, RegisterPayload>({
      query: (data) => ({
        url: `${USERS_URL}/sign-up`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/sign-out`,
        method: 'GET',
      }),
  }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation } = usersApiSlice;
