import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice"; // Ensure the path is correct

const rootReducer = combineReducers({
  [apiSlice.reducerPath]: apiSlice.reducer, // Combine your API slice
});

// Create and export the store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware), // Add middleware for the API slice
});

export default store;
