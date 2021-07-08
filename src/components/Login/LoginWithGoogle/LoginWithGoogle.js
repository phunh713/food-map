import React from "react";
import { GoogleLogin } from "react-google-login";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import useHttp from "../../../hooks/useHttp";
import { loginHandler } from "../../../store/authentication/authentication-action";
import { uiActions } from "../../../store/UI/ui-slice";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";

function LoginWithGoogle() {
	const dispatch = useDispatch();
	const { sendRequest, isLoading } = useHttp();
	const location = useLocation();
    const history = useHistory()

	const returnUrl = new URLSearchParams(location.search).get("returnUrl");

	const onGoogleResponse = (response) => {
		const { tokenId } = response;
		sendRequest(async () => {
			//LOGIN TO FIREBASE USING TOKEN ID FROM GOOGLE
			const response_loginWithGoogle = await fetch(
				`https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=${process.env.REACT_APP_FIREBASE_API}`,
				{
					method: "POST",
					body: JSON.stringify({
						postBody: `id_token=${tokenId}&providerId=google.com`,
						requestUri: "https://foodmap.phunh.com/",
						returnIdpCredential: true,
						returnSecureToken: true,
					}),
				}
			);
			const data_loginWithGoogle = await response_loginWithGoogle.json();

			if (!response_loginWithGoogle.ok)
				throw new Error(data_loginWithGoogle.error.message || "can't Login with Google Account");

			//CHECK IF THIS USER HAS DATA ON MY SERVER
			const response_getUserInfo = await fetch(
				`https://react-food-map-default-rtdb.firebaseio.com/users/${data_loginWithGoogle.localId}.json`
			);
			const data_getLoginUserInfo = await response_getUserInfo.json();

			if (!response_getUserInfo.ok)
				throw new Error(data_getLoginUserInfo.error.message || "Something went wrong while fetching");

			const { username, avatar } = data_getLoginUserInfo;

			//IF AVATAR or USERNAME IS NULL, UPDATE THEM WITH INFO FROM GOOGLE
			const response_addUser = await fetch(
				`https://react-food-map-default-rtdb.firebaseio.com/users/${data_loginWithGoogle.localId}.json?auth=${data_loginWithGoogle.idToken}`,
				{
					method: "PATCH",
					body: JSON.stringify({
						username: username || data_loginWithGoogle.displayName,
						avatar: avatar || data_loginWithGoogle.photoUrl,
					}),
				}
			);

			if (!response_addUser.ok) throw new Error("Something went wrong while fetching");

			const { idToken, email, localId, refreshToken, expiresIn } = data_loginWithGoogle;

			dispatch(
				loginHandler({
					idToken,
					email,
					localId,
					refreshToken,
					expiresIn,
					username: username || data_loginWithGoogle.displayName,
					avatar: avatar || data_loginWithGoogle.photoUrl,
				})
			);

			dispatch(uiActions.setNotification({ message: "Log In Successfully", type: "success" }));
			if (returnUrl) {
				history.replace(returnUrl);
			} else {
				history.replace("/");
			}
		});
	};
	return (
		<>
			<GoogleLogin
				clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENTID}
				buttonText="Login with Google"
				onSuccess={onGoogleResponse}
				onFailure={onGoogleResponse}
				cookiePolicy={"single_host_origin"}
			/>
			{isLoading && <LoadingSpinner />}
		</>
	);
}

export default LoginWithGoogle;
