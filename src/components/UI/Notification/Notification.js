import { useCallback, useEffect, useRef, useState } from "react";
import classes from "./Notification.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uiActions } from "../../../store/UI/ui-slice";
import ReactDOM from "react-dom";

const Notification = () => {
	const newNoti = useSelector((state) => state.ui.notification);
	const dispatch = useDispatch();
	const [milisecCount, setMilisecCount] = useState(0);

	let closeTimerRef = useRef(null);
	let closeCountdownRef = useRef(null);

	const closeHandler = useCallback(() => {
		dispatch(uiActions.setNotification({ message: "" }));
	}, [dispatch]);

	const mouseEnterHandler = () => {
		clearTimeout(closeTimerRef.current);
		clearInterval(closeCountdownRef.current);
	};

	const mouseLeaveHandler = () => {
		closeCountdownRef.current = setInterval(() => {
			setMilisecCount((prev) => prev + 10);
		}, 10);

		closeTimerRef.current = setTimeout(() => {
			closeHandler();
			clearInterval(closeCountdownRef.current);
		}, 3000 - milisecCount);
	};

	useEffect(() => {
		if (newNoti.message !== "") {
			closeCountdownRef.current = setInterval(() => {
				setMilisecCount((prev) => prev + 10);
			}, 10);

			closeTimerRef.current = setTimeout(() => {
				closeHandler();
				clearInterval(closeCountdownRef.current);
			}, 3000);
		}
		return () => {
			setMilisecCount(0);
			clearTimeout(closeTimerRef.current);
			clearInterval(closeCountdownRef.current);
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
