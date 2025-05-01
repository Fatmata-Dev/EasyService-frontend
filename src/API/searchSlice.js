// searchSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const searchSlice = createSlice({
  name: 'search',
  initialState: {
    results: [],
    isLoading: false
  },
  reducers: {
    setSearchResults: (state, action) => {
      state.results = action.payload;
    },
    clearSearchResults: (state) => {
      state.results = [];
    }  }
});

export const { setSearchResults, clearSearchResults } = searchSlice;