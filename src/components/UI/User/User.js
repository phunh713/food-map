import classes from "./User.module.css";
const User = ({
	username,
	avatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
}) => {
	const imgErrorHandler = (e) => {
		e.target.src = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png";
	};

	return (
		<div className={classes.user}>
			<img
				className={classes["user-avatar"]}
				onError={imgErrorHandler}
				src={
					avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"
				}
				alt="user avatar"
			/>
			<span>{username}</span>
		</div>
	);
};

export default User;
