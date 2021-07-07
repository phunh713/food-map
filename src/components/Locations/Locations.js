import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router";
import RouteAuth from "../../guard/RouteAuth";
import useHttp from "../../hooks/useHttp";
import { locationActions } from "../../store/location/location-slice";
import { mapActions } from "../../store/map/map-slice";
import AddLocation from "./AddLocation/AddLocation";
import LocationDetail from "./LocationDetail/LocationDetail";
import LocationList from "./LocationList/LocationList";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";

const Locations = () => {
	const { sendRequest, isLoading } = useHttp(true);
	const dispatch = useDispatch();
	const locations = useSelector((state) => state.location.locations);

	useEffect(() => {
		sendRequest(async () => {
			const response = await fetch("https://react-food-map-default-rtdb.firebaseio.com/locations.json");
			const data = await response.json();
			if (!response.ok) throw new Error(data.error.message || "SOMETHING WENT WRONG WHILE FETCHING");
			let transformedData = [];
			for (let key in data) {
				transformedData.push({ id: key, ...data[key] });
			}
			dispatch(locationActions.setAllLocations(transformedData));

			dispatch(mapActions.setCenter(transformedData[0].addressData.latLng));
		});
	}, [dispatch, sendRequest]);

	return !isLoading ? (
		<Switch>
			<Route path="/" exact>
				<LocationList locations={locations} />
			</Route>
			<RouteAuth path="/locations/add-location" component={AddLocation} />
			<RouteAuth path="/locations/edit/:id" component={AddLocation} />
			<Route path="/locations/:id" component={LocationDetail} />
		</Switch>
	) : (
		<LoadingSpinner />
	);
};

export default Locations;
