import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/UI/ui-slice";
import classes from "./MapToggle.module.css";
import mapToggleIcon from "../../../assets/images/map-toggle.png";
import { useState } from "react";

const MapToggle = () => {
	const [initialPosition, setInitialPosition] = useState({ left: "20px", top: "calc(100% - 80px)" }); //icon is 60 x 60 px
	const mapShown = useSelector((state) => state.ui.mapShown);
	const dispatch = useDispatch();

	const touchMoveHandler = (e) => {
		const left = e.changedTouches[0].clientX - 30;
		const top = e.changedTouches[0].clientY - 30;
		setInitialPosition({ left, top, bottom: "unset", right: "unset", transition: "none" });
		// console.log("X position: ",e.changedTouches[0].clientX)
		// console.log("screen width: ",e.view.innerWidth)
	};

	const touchEndHandler = (e) => {
		const posX = e.changedTouches[0].clientX - 30;
		const posY = e.changedTouches[0].clientY - 30;
		const screenX = e.view.innerWidth - 40;
		const screenY = e.view.innerHeight - 50;

		if (posX > screenX / 2) {
			if (posY >= screenY) {
				setInitialPosition({
					left: "calc(100% - 80px)",
					top: "calc(100% - 80px)",
					transition: "all ease 0.2s",
				});
			} else if (posY < 20) {
				setInitialPosition({
					left: "calc(100% - 80px)",
					top: "20px",
					transition: "all ease 0.2s",
				});
			} else {
				setInitialPosition({
					left: "calc(100% - 80px)",
					top: `${posY}px`,
					transition: "all ease 0.2s",
				});
			}
		} else {
			if (posY >= screenY) {
				setInitialPosition({
					left: "20px",
					top: "calc(100% - 80px)",
					transition: "all ease 0.2s",
				});
			} else if (posY < 20) {
                setInitialPosition({
					left: "20px",
					top: "20px",
					transition: "all ease 0.2s",
				});
			} else {
				setInitialPosition({
					left: "20px",
					top: `${posY}px`,
					transition: "all ease 0.2s",
				});
			}
		}
	};

	return (
		<div
			style={initialPosition}
			className={classes["map-toggle"]}
			onClick={() => dispatch(uiActions.toggleMapShown(!mapShown))}
			onTouchMove={touchMoveHandler}
			onTouchEnd={touchEndHandler}
		>
			<img className={classes.icon} src={mapToggleIcon} alt="icon to toggle map" />
		</div>
	);
};

export default MapToggle;
