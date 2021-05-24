import classes from "./Layout.module.css";
import Map from "../Map/Map";
import MainHeader from "./MainHeader/MainHeader";
import Notification from "../UI/Notification/Notification";
import { useSelector } from "react-redux";
import MapToggle from "./MapToggle/MapToggle";

const Layout = (props) => {
	const mapShown = useSelector((state) => state.ui.mapShown);

	return (
		<div className={classes.layout}>
			<div className={classes["main-container"]}>
				<MainHeader />
				<main className={classes.main}>{props.children}</main>
				<Notification />
			</div>
			<div className={`${classes["map-container"]} ${mapShown && classes["map-container-active"]}`}>
				<Map />
			</div>
			<MapToggle />
		</div>
	);
};

export default Layout;
