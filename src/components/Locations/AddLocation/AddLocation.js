import useDynamicForm from "../../../hooks/useDynamicForm";
import useForm from "../../../hooks/useForm";
import { addLocationFromConfig, imageFormGroup } from "../../../utils/formConfig";
import classes from "./AddLocation.module.css";
import useHttp from "../../../hooks/useHttp";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";
import { locationActions } from "../../../store/location/location-slice";
import useLocationSearchForm from "../../../hooks/useLocationSearchForm";
import { mapActions } from "../../../store/map/map-slice";
import { Redirect, useHistory, useParams } from "react-router";
import { useEffect } from "react";
import { uiActions } from "../../../store/UI/ui-slice";
import { removeAccents } from "../../../utils/transformFunctions";

const AddLocation = () => {
	const http = useHttp();
	const loggedInUser = useSelector((state) => state.authentication.user);
	const { locations } = useSelector((state) => state.location);
	const dispatch = useDispatch();
	const history = useHistory();
	const params = useParams();

	const editId = params?.id?.split("id")[1];
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

	//IMAGE INPUT CONFIG
	const {
		formFields: imagesFormFields,
		setFormSubmitted: setFormGroupSubmitted,
		formValue: imagesFormValue,
		formValid: imagesFormValid,
		resetForm: imagesFormReset,
	} = useDynamicForm({ formConfig: imageFormGroup, editValue: isAdd ? null : editLocation.images }, "images");

	const imagesInput = {
		id: "images",
		input: (
			<div key="images" className="images-wrapper">
				<label style={{ marginBottom: 5, display: "block" }}>images URLs</label>
				{imagesFormFields}
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
		[addressInput, imagesInput]
	);

	//HANDLE SUBMIT FORM
	const sumbitHandler = (e) => {
		e.preventDefault();
		setFormSearchSubmitted(true);
		setFormGroupSubmitted(true);
		setFormFieldSubmitted(true);

		if (searchValid && formFieldsValid && imagesFormValid) {
			const totalData = {
				...formFieldsValue,
				...searchValue,
				...imagesFormValue,
				userId: loggedInUser.localId,
			};

			http.sendRequest(async () => {
				let response;

				if (isAdd) {
					response = await fetch(
						`https://react-food-map-default-rtdb.firebaseio.com/locations.json?auth=${loggedInUser.idToken}`,
						{
							headers: {
								"Content-Type": "application/json",
							},
							method: "POST",
							body: JSON.stringify({ ...totalData, createdAt: new Date() }),
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
							body: JSON.stringify({ ...totalData, editedAt: new Date() }),
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
                    
					history.push(
						`/locations/${removeAccents(totalData.title).replace(" ", "-").toLowerCase()}-id${data.name}`
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
				}
			});
		}
	};

	useEffect(() => {
		if (isAdd) {
			formFieldsReset();
			imagesFormReset();
			resetSearchForm();

			return () => {
				dispatch(mapActions.setAddLocationMarker(null));
			};
		}
	}, [isAdd, formFieldsReset, imagesFormReset, resetSearchForm, dispatch]);

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
				{http.isLoading && <LoadingSpinner />}
			</>
		);
	}
	return <Redirect to="/" />;
};

export default AddLocation;
