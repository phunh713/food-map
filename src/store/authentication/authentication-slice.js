import { createSlice } from "@reduxjs/toolkit";

const authenticationSlice = createSlice({
	name: "authentication",
	initialState: {
		user: null,
	},
	reducers: {
		login: (state, action) => {
			state.user = action.payload;
		},
		logout: (state) => {
			state.user = null;
		},
		updateProfile: (state, action) => {
			state.user = { ...state.user, ...action.payload };
		},
	},
});

export const authenticationActions = authenticationSlice.actions;
export default authenticationSlice.reducer;
