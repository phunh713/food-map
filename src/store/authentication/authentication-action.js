import { authenticationActions } from "./authentication-slice";

let logoutTimer;

export const loginHandler = (user) => {
	return (dispatch) => {
        const updatedUser = { ...user, expireTimestamp: (new Date().getTime() + Number(user.expiresIn) * 1000) }
		localStorage.setItem(
			"userData",
			JSON.stringify(updatedUser)
		);
		dispatch(authenticationActions.login(updatedUser));
		logoutTimer = setTimeout(() => {
			dispatch(logoutHandler());
		}, +user.expiresIn * 1000);
	};
};

export const autoLoginHandler = () => {
	return (dispatch) => {
		const localData = localStorage.getItem("userData");

		if (localData) {
			const loginedUser = JSON.parse(localData);
			if (loginedUser.expireTimestamp > new Date().getTime()) {
				dispatch(authenticationActions.login(loginedUser));
				logoutTimer = setTimeout(() => {
					dispatch(logoutHandler());
				}, loginedUser.expireTimestamp - new Date().getTime());
			} else {
				dispatch(authenticationActions.login(null));
			}
		} else {
			dispatch(authenticationActions.login(null));
		}
	};
};

export const logoutHandler = () => {
	return (dispatch) => {
		localStorage.removeItem("userData");
		clearTimeout(logoutTimer);
		dispatch(authenticationActions.logout());
	};
};
