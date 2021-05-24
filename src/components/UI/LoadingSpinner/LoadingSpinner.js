import classes from "./LoadingSpinner.module.css";

const LoadingSpinner = (props) => {

	return (
		<div className={classes["loader-wrapper"]}>
			<div className={`${classes.loader}`}>Loading...</div>
		</div>
	);
};

export default LoadingSpinner;
