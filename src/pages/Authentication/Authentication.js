import { Route, Switch } from "react-router-dom";

const Authentication = () => {
	return (
		<Switch>
			<Route path="/login">
				<div>SignUp</div>
			</Route>
			<Route path="/signup">
				<div>SignUp</div>
			</Route>
		</Switch>
	);
};

export default Authentication;
