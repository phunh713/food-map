import { createSlice } from "@reduxjs/toolkit";

const locationSlice = createSlice({
	name: "location",
	initialState: {
		locations: [],
		filteredLocations: null,
		selectedLocationId: null,
	},
	reducers: {
		setAllLocations: (state, action) => {
			state.locations = action.payload;
		},
		updateLocation: (state, action) => {
			const updateLocationIndex = state.locations.findIndex((location) => location.id === action.payload.id);
			if (updateLocationIndex >= 0) {
				state.locations[updateLocationIndex] = action.payload;
			}
		},
		setFilteredLocations: (state, action) => {
			state.filteredLocations = action.payload;
		},
		setSelectedLocation: (state, action) => {
			state.selectedLocationId = action.payload;
		},
	},
});

export const locationActions = locationSlice.actions;
export default locationSlice.reducer;
