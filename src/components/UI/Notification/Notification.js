import { useCallback, useEffect, useState } from "react";
import classes from "./Notification.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/UI/ui-slice";
import ReactDOM from "react-dom";
let closeTimer;
let closeCountdown;

const Notification = () => {
	const newNoti = useSelector((state) => state.ui.notification);
	const dispatch = useDispatch();
	const [milisecCount, setMilisecCount] = useState(0);

	const closeHandler = useCallback(() => {
		dispatch(uiActions.setNotification({ message: "" }));
	}, [dispatch]);

	const mouseEnterHandler = () => {
		clearTimeout(closeTimer);
		clearInterval(closeCountdown);
	};

	const mouseLeaveHandler = () => {
		closeCountdown = setInterval(() => {
			setMilisecCount((prev) => prev + 10);
		}, 10);

		closeTimer = setTimeout(() => {
			closeHandler();
			clearInterval(closeCountdown);
		}, 3000 - milisecCount);
	};

	useEffect(() => {
		if (newNoti.message !== "") {
			closeCountdown = setInterval(() => {
				setMilisecCount((prev) => prev + 10);
			}, 10);

			closeTimer = setTimeout(() => {
				closeHandler();
				clearInterval(closeCountdown);
			}, 3000);
		}
		return () => {
			setMilisecCount(0);
			clearTimeout(closeTimer);
			clearInterval(closeCountdown);
		};
	}, [newNoti, closeHandler]);

	return ReactDOM.createPortal(
		newNoti.message && (
			<div
				className={`${classes.wrapper} ${classes[newNoti.type]}`}
				onMouseEnter={mouseEnterHandler}
				onMouseLeave={mouseLeaveHandler}
			>
				<div className={classes.countdown} style={{ width: `${(milisecCount / 3000) * 100}%` }}></div>
				<p className={classes.text}>{newNoti.message}</p>
				<div className={classes.close} onClick={closeHandler}>
					X
				</div>
			</div>
		),
		document.getElementById("root-notification")
	);

	// return (
	// 	newNoti.message && (
	// 		<div
	// 			className={`${classes.wrapper} ${classes[newNoti.type]}`}
	// 			onMouseEnter={mouseEnterHandler}
	// 			onMouseLeave={mouseLeaveHandler}
	// 		>
	// 			<div className={classes.countdown} style={{ width: `${(milisecCount / 3000) * 100}%` }}></div>
	// 			<p className={classes.text}>{newNoti.message}</p>
	// 			<div className={classes.close} onClick={closeHandler}>
	// 				X
	// 			</div>
	// 		</div>
	// 	)
	// );
};

export default Notification;
