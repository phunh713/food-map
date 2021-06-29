import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router";

const RouteAuth = ({ location, component: Component, ...rest }) => {
	const { user } = useSelector((state) => state.authentication);

	// return (
	// 	<Route
	// 		{...rest}
	// 		render={({ location }) => {
	// 			console.log(location);
	// 			if (user) {
	// 				return <Component />;
	// 			} else {
	// 				return <Redirect to={{ pathname: "/login", search: `?returnUrl=${location.pathname}` }} />;
	// 			}
	// 		}}
	// 	/>
	// );

	if (user) {
		return <Route component={Component} {...rest} />;
	} else {
		return <Redirect to={{ pathname: "/login", search: `?returnUrl=${location.pathname}` }} />;
	}
};

export default RouteAuth;
