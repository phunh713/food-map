import classes from './User.module.css'
const User = ({
	username,
	avatar = "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png",
}) => {
	return (
		<div className={classes.user}>
			<img className={classes["user-avatar"]} src={avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="user avatar" />
			<span>{username}</span>
		</div>
	);
};

export default User