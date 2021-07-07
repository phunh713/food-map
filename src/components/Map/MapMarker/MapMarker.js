// import { useEffect, useState } from "react";
// import comTamMarker from "../../../assets/images/com-tam-marker.png";
import { Marker, InfoBox } from "@react-google-maps/api";
import { Fragment } from "react";
import classes from "./MapMaker.module.css";
import bunBoMarker from "../../../assets/images/bun-bo-marker.png";
import addMarker from "../../../assets/images/add-marker.png";
import { useDispatch, useSelector } from "react-redux";
import { mapActions } from "../../../store/map/map-slice";
import { locationActions } from "../../../store/location/location-slice";
import { useHistory } from "react-router";
import { getLocationUrl } from "../../../utils/transformFunctions";
import { uiActions } from "../../../store/UI/ui-slice";

const infoBoxOptions = {
	closeBoxURL: "",
	enableEventPropagation: false,
	disableAutoPan: true,
	boxStyle: {
		width: "auto",
		overflow: "visible",
		maxWidth: "200px",
		display: "none"
	},
};

const MapMarker = ({ position, title, type, id }) => {
	const dispatch = useDispatch();
	const { selectedLocationId } = useSelector((state) => state.location);
	// const { hoverId } = useSelector((state) => state.map);
	const history = useHistory();

	const onClickHandler = (event) => {
		dispatch(mapActions.setPanTo(position));
		dispatch(mapActions.setZoomTo(15));
		dispatch(locationActions.setSelectedLocation(id));
		dispatch(uiActions.toggleMapShown(false));
		history.push(`/locations/${getLocationUrl(title, id)}`);
	};

	// let markerIcon = comTamMarker;
	let markerIcon = bunBoMarker;

	// if (type === "Bún Bò") markerIcon = bunBoMarker;
	if (type === "addding-marker") markerIcon = addMarker;

	// useEffect(() => {
	// 	if (selectedLocationId === id) {
	// 		setInfoBoxIsShown(true);
	// 	} else {
	// 		setInfoBoxIsShown(false);
	// 	}
	// }, [setInfoBoxIsShown, selectedLocationId, id]);

	return (
		<Fragment>
			<Marker
				icon={markerIcon}
				position={position}
				onMouseOver={() => dispatch(locationActions.setSelectedLocation(id))}
				onMouseOut={() => dispatch(locationActions.setSelectedLocation(null))}
				onClick={onClickHandler}
			/>
			<InfoBox
				position={position}
				options={{
					...infoBoxOptions,
					boxStyle: { ...infoBoxOptions.boxStyle, display: selectedLocationId === id ? "block" : "none" },
				}}
			>
				<div className={classes.infobox}>
					<span>
						[{type}] {title}
					</span>
				</div>
			</InfoBox>
		</Fragment>
	);
};

export default MapMarker;
