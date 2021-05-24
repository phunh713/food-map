import { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { uiActions } from "../store/UI/ui-slice";

const errorHandling = (error) => {
	console.log(error);
	switch (error) {
		case "INVALID_PASSWORD":
			return "Email or Password Incorrect";

		case "EMAIL_NOT_FOUND":
			return "Email or Password Incorrect";

		case "EMAIL_EXISTS":
			return "This Email has already been used";

		case "EMAIL_NOT_VERIFY":
			return "Your Email is NOT Verified yet";

		case "TOO_MANY_ATTEMPTS_TRY_LATER : Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.":
			return "Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.";

		default:
			return "An Error Occured";
	}
};

const useHttp = (startWithLoading = false) => {
	const [data, setData] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(startWithLoading);
	const dispatch = useDispatch();

	const sendRequest = useCallback(
		async (requestData) => {
			setIsLoading(true);
			try {
				const responseData = await requestData();

				setData(responseData);
				setIsLoading(false);
			} catch (error) {
				const errorMessage = errorHandling(error.message);
				dispatch(uiActions.setNotification({ message: errorMessage, type: "alert" }));
				console.error(error);

				setError(error.message);
				setIsLoading(false);
			}
		},
		[dispatch]
	);

	useEffect(() => {
		return () => {
			setError(null);
			setData(null);
			setIsLoading(false);
		};
	}, [setError, setData, setIsLoading]);

	return { sendRequest, error, data, isLoading };
};

export default useHttp;
