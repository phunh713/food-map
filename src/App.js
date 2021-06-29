import "./App.css";
import Layout from "./components/Layout/Layout";
import { Redirect, Route, Switch } from "react-router-dom";

import RouteAuth from "./guard/RouteAuth";
import { useDispatch } from "react-redux";
import { autoLoginHandler } from "./store/authentication/authentication-action";
import { useLoadScript } from "@react-google-maps/api";
import React, { Suspense, useEffect } from "react";
import LoadingSpinner from "./components/UI/LoadingSpinner/LoadingSpinner";

// import LocationPage from "./pages/Location/LocationPage";
// import Login from "./components/Login/Login";
// import NotFound from "./pages/NotFound/NotFound";
// import Signup from "./components/Signup/Signup";
// import Account from "./pages/Account/Account";

const LocationPage = React.lazy(() => import("./pages/Location/LocationPage"));
const Login = React.lazy(() => import("./components/Login/Login"));
const Signup = React.lazy(() => import("./components/Signup/Signup"));
const Account = React.lazy(() => import("./pages/Account/Account"));
const NotFound = React.lazy(() => import("./pages/NotFound/NotFound"));

const libraries = ["places"];

function App() {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: process.env.REACT_APP_GOOGLE_API,
		libraries,
	});

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(autoLoginHandler());
	}, [dispatch]);

	return isLoaded ? (
		<Suspense fallback={<LoadingSpinner />}>
			<Layout>
				<Switch>
					<Route path="/" exact component={LocationPage} />
					<Route path="/locations" component={LocationPage} />
					<Route path="/login" component={Login} />
					<Route path="/signup" component={Signup} />
					<RouteAuth path="/account" component={Account} />
					<Route path="/not-found" component={NotFound} />
					<Redirect to="/not-found" />
				</Switch>
			</Layout>
		</Suspense>
	) : loadError ? (
		<h1>Something wrong while loadscript</h1>
	) : (
		<LoadingSpinner />
	);
}

export default App;
