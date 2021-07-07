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
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#444444",
			},
		],
	},
	{
		featureType: "administrative.locality",
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
				color: "#f2f2f2",
			},
		],
	},
	{
		featureType: "landscape.man_made",
		elementType: "all",
		stylers: [
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "poi.attraction",
		elementType: "all",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.business",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.government",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.medical",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.park",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.place_of_worship",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.school",
		elementType: "labels",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "poi.sports_complex",
		elementType: "all",
		stylers: [
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "poi.sports_complex",
		elementType: "labels",
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
				saturation: -100,
			},
			{
				lightness: 45,
			},
		],
	},
	{
		featureType: "road",
		elementType: "geometry.fill",
		stylers: [
			{
				saturation: "0",
			},
			{
				visibility: "on",
			},
			{
				color: "#fefefe",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text",
		stylers: [
			{
				color: "#303030",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text.fill",
		stylers: [
			{
				color: "#aca9a9",
			},
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road",
		elementType: "labels.text.stroke",
		stylers: [
			{
				weight: "0.64",
			},
			{
				color: "#393939",
			},
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "all",
		stylers: [
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.fill",
		stylers: [
			{
				color: "#f9bc1e",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "geometry.stroke",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.fill",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "road.highway",
		elementType: "labels.text.stroke",
		stylers: [
			{
				weight: "2.99",
			},
			{
				visibility: "on",
			},
		],
	},
	{
		featureType: "road.arterial",
		elementType: "labels.icon",
		stylers: [
			{
				visibility: "off",
			},
		],
	},
	{
		featureType: "transit",
		elementType: "all",
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
				color: "#46bcec",
			},
			{
				visibility: "on",
			},
		],
	},
];

const Map = () => {
	const mapState = useSelector((state) => state.map);
	const { locations, filteredLocations } = useSelector((state) => state.location);

	const markerLocations = filteredLocations ? filteredLocations : locations;

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

			{markerLocations.map((location) => (
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
