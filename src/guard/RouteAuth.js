import { useSelector } from "react-redux";
import { Redirect, Route, useLocation } from "react-router";

const RouteAuth = ({ component: Component, ...rest }) => {
	const { user } = useSelector((state) => state.authentication);
	// const location = useLocation();

	// if (!user) {
	// 	return (
	// 		<Redirect
	// 			to={{
	// 				pathname: "/login",
	// 				search: `?returnUrl=${location.pathname}`,
	// 			}}
	// 		/>
	// 	);
	// }

	// return <Route path={path} component={Component} />;

	return (
		<Route
			{...rest}
			render={({ location }) => {
                console.log(location)
				if (user) {
					return <Component />;
				} else {
					return <Redirect to={{ pathname: "/login", search: `?returnUrl=${location.pathname}` }} />;
				}
			}}
		/>
	);
};

export default RouteAuth;
