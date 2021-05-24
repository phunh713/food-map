import useHttp from "../../hooks/useHttp";
import useForm from "../../hooks/useForm";
import { signupFormConfig } from "../../utils/formConfig";
import { useHistory, useLocation } from "react-router";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/UI/ui-slice";

const Signup = () => {
	const http = useHttp();
	const history = useHistory();
	const dispatch = useDispatch();
	const { search } = useLocation();

	const { formFields, formValid, setFormSubmitted, resetForm, formValue } = useForm({ formConfig: signupFormConfig });

	const submitHandler = (e) => {
		e.preventDefault();
		setFormSubmitted(true);
		if (formValid) {
			http.sendRequest(async () => {
				const response_signup = await fetch(
					`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.REACT_APP_FIREBASE_API}`,
					{
						method: "POST",
						body: JSON.stringify({
							email: formValue.email,
							password: formValue.password,
							returnSecureToken: true,
						}),
					}
				);
				const data_signup = await response_signup.json();

				if (!response_signup.ok)
					throw new Error(data_signup.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				const { idToken, localId } = data_signup;

				const response_verifyEmail = await fetch(
					`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${process.env.REACT_APP_FIREBASE_API}`,
					{
						method: "POST",
						body: JSON.stringify({
							requestType: "VERIFY_EMAIL",
							idToken,
						}),
					}
				);
				const data_verifyEmail = await response_verifyEmail.json();
				if (!response_verifyEmail.ok)
					throw new Error(data_verifyEmail.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				const response_addUser = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/users/${localId}.json?auth=${data_signup.idToken}`,
					{
						method: "PUT",
						body: JSON.stringify({
							username: formValue.username,
						}),
					}
				);

				const data_addUser = await response_addUser.json();

				if (!response_addUser.ok)
					throw new Error(data_addUser.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				dispatch(
					uiActions.setNotification({
						message:
							"Sign Up Successfully! A Verification Link has been sent to Your Email, please check your inbox!",
						type: "success",
					})
				);
				history.push({ pathname: "/login", search: search });
				resetForm();
			});
		}
	};
	return (
		<>
			<form className="form" onSubmit={submitHandler}>
				{formFields}
				<div className="form-action">
					<button className="btn" type="submit">
						Sign Up
					</button>
				</div>
			</form>
			{http.isLoading && <LoadingSpinner />}
		</>
	);
};

export default Signup;
