import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
	name: "ui",
	initialState: {
		isLoading: false,
		notification: {
			message: "",
			type: null,
		},
		mapShown: false,
	},
	reducers: {
		setIsLoading(state, action) {
			console.log(action.payload);
			state.isLoading = action.payload;
		},
		setNotification(state, action) {
			state.notification = { ...state.notification, message: action.payload.message, type: action.payload.type };
		},
		toggleMapShown(state) {
			state.mapShown = !state.mapShown;
		},
	},
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
