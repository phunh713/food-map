import { GoogleMap } from "@react-google-maps/api";
import { useSelector } from "react-redux";
import MapMarker from "./MapMarker/MapMarker";
import MapPanningComponent from "./MapPanningComponent/MapPanningComponent";

const containerStyle = {
	width: "100%",
	height: "100%",
};

const mapStyle = [
	{
		featureType: "administrative",
		elementType: "all",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "landscape",
		elementType: "all",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi",
		elementType: "all",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		elementType: "all",
		stylers: [
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "road.local",
		stylers: [
			{
				visibility: "simplified",
			},
		],
	},
	{
		featureType: "road.local",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#ebebeb",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "all",
		stylers: [
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "water",
		elementType: "all",
		stylers: [
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "water",
		elementType: "geometry",
		stylers: [
			{
				color: "#12608d",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.fill",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "water",
		elementType: "labels.text.stroke",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
];

const Map = () => {
	const mapState = useSelector((state) => state.map);
	const locations = useSelector((state) => state.location.locations);



	return (
		<GoogleMap
			mapContainerStyle={containerStyle}
			center={mapState.center}
			zoom={mapState.zoom}
			options={{ styles: mapStyle }}
		>
			{mapState.addLocationMarker && (
				<MapMarker position={mapState.addLocationMarker} title="Your New Location" type="addding-marker" />
			)}

			{locations.map((location) => (
				<MapMarker
					position={location.addressData.latLng}
					title={location.title}
					type={location.type}
					key={location.id}
					id={location.id}
				/>
			))}

			<MapPanningComponent />
		</GoogleMap>
	);
};

export default Map;
