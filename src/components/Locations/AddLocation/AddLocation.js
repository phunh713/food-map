// import useDynamicForm from "../../../hooks/useDynamicForm";
// import { imageFormGroup } from "../../../utils/formConfig";
import useForm from "../../../hooks/useForm";
import { addLocationFromConfig } from "../../../utils/formConfig";
import classes from "./AddLocation.module.css";
import useHttp from "../../../hooks/useHttp";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";
import useLocationSearchForm from "../../../hooks/useLocationSearchForm";
import { mapActions } from "../../../store/map/map-slice";
import { Redirect, useHistory, useParams } from "react-router";
import { useEffect } from "react";
import { uiActions } from "../../../store/UI/ui-slice";
import { removeAccents } from "../../../utils/transformFunctions";
import { locationActions } from "../../../store/location/location-slice";
import useUploadImages from "../../../hooks/useUploadImages";
import { storage } from "../../../firebase/firebase";
import { useState } from "react";

const AddLocation = () => {
	const [isUploadingImg, setIsUploadingImg] = useState(false);

	const http = useHttp();
	const loggedInUser = useSelector((state) => state.authentication.user);
	const { locations } = useSelector((state) => state.location);
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();

	const editId = params?.id?.split("-id")[1];
	const editIndex = locations.findIndex((location) => location.id === editId);
	const editLocation = locations[editIndex];
	const isEdit = history.location.pathname.includes("/locations/edit/") && editIndex > -1;
	const isAdd = history.location.pathname === "/locations/add-location";

	//ADDRESS INPUT CONFIG
	const {
		searchField,
		resetForm: resetSearchForm,
		setIsFormSubmitted: setFormSearchSubmitted,
		searchValue,
		searchValid,
	} = useLocationSearchForm(true, isEdit ? editLocation.addressData : null);

	const addressInput = {
		id: "address",
		input: (
			<div className="form-control address" key="address">
				<label>Address</label>
				{searchField}
			</div>
		),
	};

	//DYNAMIC IMAGE INPUT CONFIG
	// const {
	// 	formFields: imagesFormFields,
	// 	setFormSubmitted: setFormGroupSubmitted,
	// 	formValue: imagesFormValue,
	// 	formValid: imagesFormValid,
	// 	resetForm: imagesFormReset,
	// } = useDynamicForm({ formConfig: imageFormGroup, editValue: isAdd ? null : editLocation.images }, "images");

	// const imagesInput = {
	// 	id: "images",
	// 	input: (
	// 		<div key="images" className="images-wrapper">
	// 			<label style={{ marginBottom: 5, display: "block" }}>images URLs</label>
	// 			{imagesFormFields}
	// 		</div>
	// 	),
	// };

	//UPLOAD IMAGES INPUT
	const {
		formField: uploadImgField,
		setFormSubmitted: setUploadImgSubmitted,
		isValid: uploadImgValid,
		images: uploadImgValue,
	} = useUploadImages(true, isEdit ? editLocation.images : []);

	const imagesUploadInput = {
		id: "imagesUpload",
		input: (
			<div key="imagesUpload" className="images-upload-wrapper">
				{uploadImgField}
			</div>
		),
	};

	//TOTAL FORM CONFIG
	const {
		formFields: totalFormFields,
		setFormSubmitted: setFormFieldSubmitted,
		formValue: formFieldsValue,
		formValid: formFieldsValid,
		resetForm: formFieldsReset,
	} = useForm(
		{
			formConfig: addLocationFromConfig,
			editValue: isAdd ? null : { type: editLocation.type, title: editLocation.title, note: editLocation.note },
		},
		[addressInput, imagesUploadInput]
	);

	//HANDLE SUBMIT FORM
	const sumbitHandler = (e) => {
		e.preventDefault();
		setFormSearchSubmitted(true);
		// setFormGroupSubmitted(true);
		setFormFieldSubmitted(true);
		setUploadImgSubmitted(true);

		// if (searchValid && formFieldsValid && imagesFormValid && uploadImgValid) {
		if (searchValid && formFieldsValid && uploadImgValid) {
			let imagesValuePromise = [];
			setIsUploadingImg(true);

			for (let image of uploadImgValue) {
				if (!image.image_url) {
					const promise = new Promise((resolve, reject) => {
						const storageRef = storage.ref(
							`images/${image.name}-${new Date().getTime()}-${loggedInUser.localId}`
						);
						storageRef.put(image.file).on(
							"state_changed",
							(snapshot) => {},
							(err) => console.log(err),
							() => {
								storageRef
									.getDownloadURL()
									.then((url) => resolve(url))
									.catch((err) => reject(err));
							}
						);
					});

					imagesValuePromise.push(promise);
				}
			}

			Promise.all(imagesValuePromise).then((URLs) => {
				setIsUploadingImg(false);

				const imgValueOfLocalFiles = URLs.map((url) => {
					return { image_url: url };
				});

				const imgValueOfOtherSource = uploadImgValue.filter((img) => !!img.image_url);

				const totalImgValue = [...imgValueOfOtherSource, ...imgValueOfLocalFiles];

				const totalData = {
					...formFieldsValue,
					...searchValue,
					images: totalImgValue,
					userId: loggedInUser.localId,
				};

				http.sendRequest(async () => {
					const time = new Date().getTime();
					let response;

					if (isAdd) {
						response = await fetch(
							`https://react-food-map-default-rtdb.firebaseio.com/locations.json?auth=${loggedInUser.idToken}`,
							{
								headers: {
									"Content-Type": "application/json",
								},
								method: "POST",
								body: JSON.stringify({ ...totalData, createdAt: time }),
							}
						);
					}

					if (isEdit) {
						response = await fetch(
							`https://react-food-map-default-rtdb.firebaseio.com/locations/${editId}.json?auth=${loggedInUser.idToken}`,
							{
								headers: {
									"Content-Type": "application/json",
								},
								method: "PATCH",
								body: JSON.stringify({ ...totalData, editedAt: time }),
							}
						);
					}

					const data = await response.json();
					if (!response.ok) throw new Error(data.error || "SOMETHING WRONG WHILE FETCHING");

					if (isAdd) {
						dispatch(
							uiActions.setNotification({
								message: `Location [${totalData.title}] Successfully Added`,
								type: "success",
							})
						);

						dispatch(
							locationActions.setAllLocations([
								...locations,
								{ ...totalData, id: data.name, createdAt: time },
							])
						);

						history.push(
							`/locations/${removeAccents(totalData.title).split(" ").join("-").toLowerCase()}-id${
								data.name
							}`
						);
					}

					if (isEdit) {
						dispatch(
							uiActions.setNotification({
								message: `Location [${totalData.title}] Successfully Updated`,
								type: "success",
							})
						);

						history.push(`/locations/${params.id}`);

						dispatch(locationActions.updateLocation({ ...totalData, id: editId, editedAt: time }));
					}
				});
			});
		}
	};

	useEffect(() => {
		if (isAdd) {
			formFieldsReset();
			// imagesFormReset();
			resetSearchForm();

			return () => {
				dispatch(mapActions.setAddLocationMarker(null));
			};
		}
	}, [isAdd, formFieldsReset, resetSearchForm, dispatch]);

	if ((isEdit && editLocation.userId === loggedInUser.localId) || isAdd) {
		return (
			<>
				<div className={classes["form-wrapper"]} onSubmit={sumbitHandler}>
					<form className="form">
						{totalFormFields}
						<div className="form-action">
							<button className="btn" type="submit">
								{isAdd ? `Add New Location` : `Update Location`}
							</button>
						</div>
					</form>
				</div>
				{(http.isLoading || isUploadingImg) && <LoadingSpinner />}
			</>
		);
	}

	return <Redirect to="/" />;
};

export default AddLocation;
