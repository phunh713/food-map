import { useGoogleMap } from "@react-google-maps/api";
import { useEffect } from "react";
import { useSelector } from "react-redux";

function MapPanningComponent() {
	const map = useGoogleMap();
	const mapState = useSelector((state) => state.map);

	useEffect(() => {
        map.setZoom(15)
		map.panTo(mapState.panTo);
		return () => {
			return;
		};
	}, [map, mapState.panTo]);

	return null;
}

export default MapPanningComponent;
