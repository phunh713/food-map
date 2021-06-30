import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { locationActions } from "../../../store/location/location-slice";
import { mapActions } from "../../../store/map/map-slice";
import LocationFilter from "../LocationFilter/LocationFilter";
import classes from "./LocationList.module.css";
import LocationListItem from "./LocationListItem/LocationListItem";

const LocationList = ({ locations, ownerView }) => {
	const [filteredLocations, setFilteredLocations] = useState(locations);
	const dispatch = useDispatch();
	const timerRef = useRef(null);

	const selectFilterHandler = (filterlocations) => {
		setFilteredLocations(filterlocations);
		dispatch(locationActions.setFilteredLocations(filterlocations));

		if (filterlocations.length) {
			dispatch(mapActions.setPanTo(filterlocations[0].addressData.latLng));
			dispatch(locationActions.setSelectedLocation(filterlocations[0].id));
		} else {
			dispatch(locationActions.setSelectedLocation(null));
		}
	};

	const mouseEnterHandler = (latLng, id) => {
		if (timerRef.current) {
			clearTimeout(timerRef.current);
		}

		timerRef.current = setTimeout(() => {
			dispatch(mapActions.setPanTo(latLng));
			dispatch(locationActions.setSelectedLocation(id));
		}, 500);
	};

	return (
		<>
			<LocationFilter onSelectFilter={selectFilterHandler} locations={locations} />
			<div className={classes["list-wrapper"]}>
				{filteredLocations.length ? (
					filteredLocations.map((location) => {
						return (
							<LocationListItem
								ownerView={ownerView}
								key={location.id}
								latLng={location.addressData.latLng}
								title={location.title}
								id={location.id}
								address={location.addressData}
								thumbnail={location.images[0].image_url}
								userId={location.userId}
								type={location.type}
								onMouseEnter={mouseEnterHandler}
							/>
						);
					})
				) : (
					<p>
						No Locations Found,
						{locations.length ? " Please Select Other Filters" : " Please Add New Location"}
					</p>
				)}
			</div>
		</>
	);
};

export default LocationList;
