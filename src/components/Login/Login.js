import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from "react-router";
import { Link } from "react-router-dom";
import useForm from "../../hooks/useForm";
import useHttp from "../../hooks/useHttp";
import { loginHandler } from "../../store/authentication/authentication-action";
import { uiActions } from "../../store/UI/ui-slice";
import { loginFormConfig } from "../../utils/formConfig";
import LoadingSpinner from "../UI/LoadingSpinner/LoadingSpinner";

const Login = () => {
	const http = useHttp();
	const dispatch = useDispatch();
	const history = useHistory();
	const location = useLocation();
	const { user } = useSelector((state) => state.authentication);

	const { formFields, formValid, setFormSubmitted, resetForm, formValue } = useForm({ formConfig: loginFormConfig });

	const returnUrl = new URLSearchParams(location.search).get("returnUrl");

	const submitHandler = (e) => {
		e.preventDefault();
		setFormSubmitted(true);

		if (formValid) {
			http.sendRequest(async () => {
				//LOG IN API
				const response_1 = await fetch(
					`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.REACT_APP_FIREBASE_API}`,
					{ method: "POST", body: JSON.stringify({ ...formValue, returnSecureToken: true }) }
				);

				const data_1 = await response_1.json();

				if (!response_1.ok) throw new Error(data_1.error.message || "SOMETHING WENT WRONG WHILE FECTHING DATA");

				//GET USER DATA
				const response_2 = await fetch(
					`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${process.env.REACT_APP_FIREBASE_API}`,
					{
						method: "POST",
						body: JSON.stringify({
							idToken: data_1.idToken,
						}),
					}
				);
				const data_2 = await response_2.json();

				if (!response_2.ok) throw new Error(data_1.error.message || "SOMETHING WENT WRONG WHILE FECTHING DATA");

				//IF GET USER DATA OK ==> GET USER INFO
				const response_getLoginUserInfo = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/users/${data_1.localId}.json`
				);
				const data_getLoginUserInfo = await response_getLoginUserInfo.json();

				if (!response_getLoginUserInfo.ok)
					throw new Error(data_getLoginUserInfo.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				//IF EMAIL IS VERIFIED, LOG USER IN (WITH RETURNURL IF THERE IS)
				const { emailVerified } = data_2.users[0];
				if (emailVerified) {
					dispatch(loginHandler({ ...data_1, ...data_getLoginUserInfo }));
					resetForm();

					dispatch(uiActions.setNotification({ message: "Log In Successfully", type: "success" }));
					if (returnUrl) {
						history.push(returnUrl);
					} else {
						history.push("/");
					}
				} else {
					throw new Error("EMAIL_NOT_VERIFY");
				}
			});
		}
	};

	if (user) return <Redirect to="/" />;

	return (
		<>
			<form className="form" onSubmit={submitHandler}>
				{formFields}
				<div className="form-action">
					<button type="submit" className="btn">
						Log In
					</button>
					<Link to={{ pathname: "/signup", search: location.search }}>No Account? Create Now!</Link>
				</div>
			</form>
			{http.isLoading && <LoadingSpinner />}
		</>
	);
};

export default Login;
