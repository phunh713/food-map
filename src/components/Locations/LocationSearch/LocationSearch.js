import { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { mapActions } from "../../../store/map/map-slice";
import classes from "./LocationSearch.module.css";

const LocationSearch = ({ isFormSubmitted, onChange, value, isTouched, isValid, errorMessage }) => {
	const [isTyping, setIsTyping] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [addressData, setAddressData] = useState(null);

	const dispatch = useDispatch();

	const getSearchDataToEmit = (address) => {
		const findAddressComponent = (components, findType) => {
			return components.find((component) => component.types.find((type) => type === findType))?.long_name || null;
		};
		let city = "";
		let district = "";
		let street = "";

		geocodeByAddress(address)
			.then((results) => {
				city = findAddressComponent(results[0].address_components, "administrative_area_level_1");
				district = findAddressComponent(results[0].address_components, "administrative_area_level_2");
				street = findAddressComponent(results[0].address_components, "route");

				return getLatLng(results[0]);
			})
			.then((latLng) => {
				dispatch(mapActions.setPanTo(latLng));
				dispatch(mapActions.setAddLocationMarker(latLng));
				onChange({
					addressData: { latLng, full_address: address, city, district, street },
					value: address,
				});
				setIsLoading(false);
				setAddressData({ latLng, full_address: address, city, district, street });

				console.log("select inside");
			})
			.catch((error) => {
				dispatch(mapActions.setAddLocationMarker(null));
				onChange({ addressData: null, value: address });
				console.error("Error", error);
				setIsLoading(false);
				setAddressData(null);
			});
	};

	const handleChange = (value) => {
		setIsTyping(true);
		onChange({ value: value, addressData: null });
		console.log("change");
	};

	const handleBlur = (e) => {
		setIsTyping(false);
		onChange({ addressData, value: e.target.value });
		console.log("blur");
	};

	const handleSelect = (address) => {
		setIsLoading(true);
		setIsTyping(false);
		getSearchDataToEmit(address);
        console.log("select outside");
	};

	return (
		<PlacesAutocomplete value={value} onChange={handleChange} onSelect={handleSelect}>
			{({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
				return (
					<>
						<input
							{...getInputProps({
								className: "location-search-input",
								onBlur: handleBlur,
							})}
							disabled={isLoading}
						/>
						{!isValid && !isTyping && (isFormSubmitted || isTouched) && !isLoading && (
							<span className="error">{errorMessage}</span>
						)}
						{!!suggestions.length && (
							<div className={classes["autocomplete-dropdown-container"]}>
								{loading && <div>Loading...</div>}
								{suggestions.map((suggestion) => {
									const className = suggestion.active
										? classes["suggestion-item--active"]
										: classes["suggestion-item"];
									return (
										<div
											key={suggestion.placeId}
											{...getSuggestionItemProps(suggestion, {
												className,
											})}
										>
											<span>{suggestion.description}</span>
										</div>
									);
								})}
							</div>
						)}
					</>
				);
			}}
		</PlacesAutocomplete>
	);
};

export default LocationSearch;
