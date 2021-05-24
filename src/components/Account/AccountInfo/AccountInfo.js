import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useForm from "../../../hooks/useForm";
import useHttp from "../../../hooks/useHttp";
import { loginHandler } from "../../../store/authentication/authentication-action";
import maleIcon from "../../../assets/images/male.png";
import femaleIcon from "../../../assets/images/female.png";
import lgbtIcon from "../../../assets/images/lgbt.png";
import { editUserProfile } from "../../../utils/formConfig";
import LocationList from "../../Locations/LocationList/LocationList";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";
import classes from "./AccountInfo.module.css";

const AccountInfo = () => {
	const [isEdit, setIsEdit] = useState(false);
	const { user } = useSelector((state) => state.authentication);
	const { sendRequest, isLoading } = useHttp();
	const { sendRequest: getLocationByUserId, data } = useHttp(true);
	const dispatch = useDispatch();
	const { formFields, setFormSubmitted, formValid, formValue } = useForm({
		formConfig: editUserProfile,
		editValue: { username: user.username, avatar: user?.avatar || "", biography: user?.biography || "" },
	});

	const updateProfileHandler = (e) => {
		e.preventDefault();
		setFormSubmitted(true);

		console.log(formValid);

		if (formValid) {
			sendRequest(async () => {
				//SEND USER INFO
				const response_setProfile = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/users/${user.localId}.json?auth=${user.idToken}`,
					{
						method: "PATCH",
						body: JSON.stringify(formValue),
					}
				);

				const data_setProfile = await response_setProfile.json();

				if (!response_setProfile.ok)
					throw new Error(data_setProfile.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				//GET USER INFO
				const response_getProfile = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/users/${user.localId}.json`
				);

				const data_getProfile = await response_getProfile.json();

				if (!response_getProfile.ok)
					throw new Error(data_getProfile.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				dispatch(loginHandler({ ...user, ...data_getProfile }));

				setIsEdit(false);
			});
		}
	};

	let genderSrc;

	if (user.gender === "Male") genderSrc = maleIcon;
	if (user.gender === "Female") genderSrc = femaleIcon;
	if (user.gender === "LGBT") genderSrc = lgbtIcon;

	useEffect(() => {
		getLocationByUserId(async () => {
			const response = await fetch(
				`https://react-food-map-default-rtdb.firebaseio.com/locations.json?orderBy="userId"&equalTo="${user.localId}"`
			);

			const data = await response.json();
			if (!response.ok) throw new Error(data.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

			let transformLocations = [];

			for (let key in data) {
				transformLocations.push({ id: key, ...data[key] });
			}

			return transformLocations;
		});
	}, [user.localId, getLocationByUserId]);

	return !isLoading && data ? (
		<>
			<div className={classes["account-avatar-username"]}>
				<div className={classes["avatar-wrapper"]}>
					<img
						className={classes.avatar}
						src={
							user.avatar ||
							`https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png`
						}
						alt="user avatar"
					/>
				</div>
				<h1>
					{user.username}
					{user.gender && <img className={classes["gender-icon"]} src={genderSrc} alt="male icon red" />}
				</h1>
				<p>{user.biography}</p>
				{!isEdit && (
					<button className={classes.btn} type="button" onClick={() => setIsEdit(true)}>
						Edit Profile
					</button>
				)}
			</div>

			{isEdit && (
				<form style={{ padding: 25 }} onSubmit={updateProfileHandler}>
					{formFields}
					<div className="form-action">
						<button className="btn" type="submit">
							Update Profile
						</button>
						<button className="btn btn-danger" type="button" onClick={() => setIsEdit(false)}>
							Cancel
						</button>
					</div>
				</form>
			)}
			<div>
				<h2>Your Locations</h2>
				<LocationList locations={data} ownerView />
			</div>
		</>
	) : (
		<LoadingSpinner />
	);
};

export default AccountInfo;
