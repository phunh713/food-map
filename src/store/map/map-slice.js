import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
	name: "map",
	initialState: {
		center: { lat: 10.8230989, lng: 106.6296638 },
		panTo: { lat: 10.8230989, lng: 106.6296638 },
		zoom: 14,
		addLocationMarker: null,
		hoverId: null,
	},
	reducers: {
		setCenter: (state, action) => {
			state.center = action.payload;
		},
		setPanTo: (state, action) => {
			state.panTo = action.payload;
		},
		increaseZoomBy: (state, action) => {
			state.zoom += action.payload;
		},
		decreaseZoomBy: (state, action) => {
			state.zoom -= action.payload;
		},
		setZoomTo: (state, action) => {
			state.zoom = action.payload;
		},
		setAddLocationMarker: (state, action) => {
			state.addLocationMarker = action.payload;
		},
		setHoverId(state, action) {
			state.hoverId = action.payload;
		},
	},
});

export const mapActions = mapSlice.actions;

export default mapSlice.reducer;
