import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./location/location-slice";
import authenticationReducer from "./authentication/authentication-slice";
import uiReducer from "./UI/ui-slice";
import mapReducer from "./map/map-slice";

const store = configureStore({
	reducer: {
		location: locationReducer,
		authentication: authenticationReducer,
		ui: uiReducer,
		map: mapReducer,
	},
});

export default store;
