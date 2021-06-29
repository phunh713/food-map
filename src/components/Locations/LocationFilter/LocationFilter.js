import React, { useState, useMemo } from "react";
import classes from "./LocationFilter.module.css";
import { getFilterArrayByKeys, getUniqueValue } from "../../../utils/transformFunctions";

const LocationFilter = ({ onSelectFilter, locations }) => {
	const [type, setType] = useState("all");
	const [city, setCity] = useState("all");
	const [district, setDistrict] = useState("all");

	let typeSelectOptions = useMemo(
		() => ["all", ...getUniqueValue(locations.map((location) => location.type))],
		[locations]
	);

	let citySelectOptions = useMemo(
		() => ["all", ...getUniqueValue(locations.map((location) => location.addressData.city))],
		[locations]
	);

	const filteredLocationsByCity = useMemo(() => getFilterArrayByKeys(locations, { city }), [locations, city]);

	let districtSelectOptions = useMemo(
		() => ["all", ...getUniqueValue(filteredLocationsByCity.map((location) => location.addressData.district))],
		[filteredLocationsByCity]
	);

	const selectTypeHandler = (e) => {
		setType(e.target.value);
		const _filterLocations = getFilterArrayByKeys(locations, { type: e.target.value, city, district });
		onSelectFilter(_filterLocations);
	};

	const selectCityHandler = (e) => {
		setCity(e.target.value);
		setDistrict("all");
		const _filterLocations = getFilterArrayByKeys(locations, { type, city: e.target.value });
		onSelectFilter(_filterLocations);
	};

	const selectDistrictHandler = (e) => {
		setDistrict(e.target.value);
		const _filterLocations = getFilterArrayByKeys(locations, { type, district: e.target.value });
		setCity(_filterLocations[0].addressData.city);
		onSelectFilter(_filterLocations);
	};

	return (
		<div className={classes["filter-wrapper"]}>
			<div className="form-control">
				<label htmlFor="type">Type</label>
				<select value={type} name="type" id="type" onChange={selectTypeHandler}>
					{typeSelectOptions.map((type) =>
						type ? (
							<option value={type} key={type}>
								{type === "all" ? "All Types" : type}
							</option>
						) : null
					)}
				</select>
			</div>

			<div className="form-control">
				<label htmlFor="city">City</label>
				<select value={city} name="city" id="city" onChange={selectCityHandler}>
					{citySelectOptions.map((city) =>
						city ? (
							<option value={city} key={city}>
								{city === "all" ? "All Cities" : city}
							</option>
						) : null
					)}
				</select>
			</div>

			<div className="form-control">
				<label htmlFor="district">District</label>
				<select value={district} name="district" id="district" onChange={selectDistrictHandler}>
					{districtSelectOptions.map((district) =>
						district ? (
							<option value={district} key={district}>
								{district === "all" ? "All Districts" : district}
							</option>
						) : null
					)}
				</select>
			</div>
		</div>
	);
};

export default LocationFilter;
