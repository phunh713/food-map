import { useState } from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { useDispatch } from "react-redux";
import { mapActions } from "../../../store/map/map-slice";
import classes from "./LocationSearch.module.css";

const LocationSearch = ({ isFormSubmitted, onChange, value, isTouched, isValid, errorMessage }) => {
	const [isTyping, setIsTyping] = useState(false);

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

                console.log(results[0])

				return getLatLng(results[0]);
			})
			.then((latLng) => {
				dispatch(mapActions.setPanTo(latLng));
				dispatch(mapActions.setAddLocationMarker(latLng));
				onChange({
					addressData: { latLng, full_address: address, city, district, street },
					value: address,
				});
			})
			.catch((error) => {
				dispatch(mapActions.setAddLocationMarker(null));
				onChange({ addressData: null, value: address });
				console.error("Error", error);
			});
	};

	const handleChange = (value) => {
		setIsTyping(true);
		onChange({value: value, searchData: null})
	};

	const handleBlur = (e) => {
		setIsTyping(false);
		getSearchDataToEmit(e.target.value);
        // onChange({ addressData: null, value: e.target.value });
	};

	const handleSelect = (address) => {
		getSearchDataToEmit(address);
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
						/>
						{!isValid && !isTyping && (isFormSubmitted || isTouched) && (
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
