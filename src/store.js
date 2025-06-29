import { configureStore } from '@reduxjs/toolkit';
import { servicesApi } from './API/servicesApi';
import { demandesApi } from './API/demandesApi';
import { authApi } from './API/authApi';
import { messagesApi } from './API/messagesApi';
import { searchApi } from './API/searchApi';

export const store = configureStore({
  reducer: {
    [servicesApi.reducerPath]: servicesApi.reducer,
    [demandesApi.reducerPath]: demandesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
  .concat(servicesApi.middleware)
  .concat(demandesApi.middleware)
  .concat(authApi.middleware)
  .concat(messagesApi.middleware)
  .concat(searchApi.middleware),
});