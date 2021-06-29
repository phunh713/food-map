import classes from "./LocationListItem.module.css";
import { useDispatch } from "react-redux";
import { locationActions } from "../../../../store/location/location-slice";
import { mapActions } from "../../../../store/map/map-slice";
import React, { useEffect } from "react";
import useHttp from "../../../../hooks/useHttp";
import { useHistory } from "react-router";
import { getLocationUrl } from "../../../../utils/transformFunctions";
import User from "../../../UI/User/User";
import LoadingSpinner from "../../../UI/LoadingSpinner/LoadingSpinner";
import Badge from "../../../UI/Badge/Badge";

const LocationListItem = ({ latLng, title, ownerView, id, address, thumbnail, userId, type, onMouseEnter }) => {
	const dispatch = useDispatch();
	const { sendRequest, data, isLoading } = useHttp();
	const history = useHistory();

	const onClickHandler = () => {
		dispatch(mapActions.setPanTo(latLng));
		dispatch(mapActions.setZoomTo(15));
		dispatch(locationActions.setSelectedLocation(id));
		history.push(`/locations/${getLocationUrl(title, id)}`);
	};

	const clickEditHandler = () => {
		history.push(`/locations/edit/${getLocationUrl(title, id)}`);
	};

	const mouseEnterHandler = () => {
		onMouseEnter(latLng, id);
	};

	useEffect(() => {
		if (!ownerView) {
			sendRequest(async () => {
				const response_getUserInfo = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/users/${userId}.json`
				);
				const data_getUserInfo = await response_getUserInfo.json();
				if (!response_getUserInfo.ok)
					throw new Error(data_getUserInfo.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				return data_getUserInfo;
			});
		}
	}, [sendRequest, userId, ownerView]);

    console.log(isLoading)

	return (
		<div className={classes["list-item-wrapper"]} onMouseEnter={mouseEnterHandler}>
			{!isLoading ? (
				<>
					<div onClick={onClickHandler} className={classes["list-item-thumbnail-wrapper"]}>
						<img src={thumbnail} alt={`${title}`} />
					</div>
					<div onClick={onClickHandler} className={classes["list-item-info-wrapper"]}>
						<div className={`${classes["item-type"]}`}>
							<Badge type={type}>{type}</Badge>
						</div>
						<div className={classes["item-title"]}>
							<span>{title}</span>
						</div>
						<div className={classes["item-address"]}>
							<span>{address.full_address}</span>
						</div>
						{!ownerView && (
							<div className={classes["user-info"]}>
								<User username={data?.username} avatar={data?.avatar} />
							</div>
						)}
					</div>
					{ownerView && (
						<div className={classes["list-item-edit"]} onClick={clickEditHandler}>
							Edit
						</div>
					)}
				</>
			) : (
				<LoadingSpinner />
			)}
		</div>
	);
};

export default React.memo(LocationListItem);
