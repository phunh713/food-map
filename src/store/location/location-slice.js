import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
	name: "location",
	initialState: {
		locations: [],
		selectedLocationId: null,
	},
	reducers: {
		setAllLocations: (state, action) => {
			state.locations = action.payload;
		},
		setSelectedLocation: (state, action) => {
			state.selectedLocationId = action.payload;
		},
	},
});

export const locationActions = locationSlice.actions;
export default locationSlice.reducer;
