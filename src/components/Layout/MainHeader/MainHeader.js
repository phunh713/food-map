import { Link, NavLink, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import classes from "./MainHeader.module.css";
import { logoutHandler } from "../../../store/authentication/authentication-action";
import { useState } from "react";
import User from "../../UI/User/User";

const MainHeader = () => {
	const [userMenuShown, setUserMenuShown] = useState(false);
	const [toggleActive, setToggleActive] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const { user } = useSelector((state) => state.authentication);

	const logoutBtnHandler = () => {
        clickLinkHandler();
		setUserMenuShown(false);
		dispatch(logoutHandler());
		history.push("/login");
	};

	const clickToggleHandler = () => {
		setToggleActive(!toggleActive);
		setUserMenuShown(!userMenuShown);
	};

	const clickLinkHandler = () => {
		setToggleActive(false);
		setUserMenuShown(false);
	};

	return (
		<header className={classes.header}>
			<div className={classes.logo} onClick={() => history.push("/")}>Food Map</div>
			<div className={`${classes["toggle-menu"]} ${toggleActive && classes["toggle-menu-active"]}`} onClick={clickToggleHandler}>
				<span></span>
				<span></span>
				<span></span>
			</div>
			<nav className={`${classes.nav} ${toggleActive && classes.active}`}>
				<NavLink to="/" activeClassName={classes.active} exact onClick={clickLinkHandler}>
					HomePage
				</NavLink>
				{user && (
					<NavLink to="/locations/add-location" activeClassName={classes.active} onClick={clickLinkHandler}>
						Add Location
					</NavLink>
				)}
				{!user && (
					<NavLink to="/login" onClick={clickLinkHandler}>
						Log In / Register
					</NavLink>
				)}
				{user && (
					<div
						className={classes["user"]}
						onMouseEnter={() => setUserMenuShown(true)}
						onMouseLeave={() => setUserMenuShown(false)}
					>
						<User username={user.username} avatar={user.avatar} />

						{userMenuShown && (
							<div className={classes["user-menu"]}>
								<Link to="/account" onClick={clickLinkHandler}>
									Account
								</Link>
								<span onClick={logoutBtnHandler}>
									Log Out
								</span>
							</div>
						)}
					</div>
				)}
			</nav>
		</header>
	);
};

export default MainHeader;
