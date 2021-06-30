import classes from "./Badge.module.css";

const Badge = ({ children, type }) => {
    let bgColor = "#CD113B";

    // if (type === "Bún Bò") bgColor = "#FF7600"
    // if (type === "Cơm Tấm") bgColor = "#CD113B"
    // if (type === "Phở") bgColor = "#52006A"

	return (
		<div className={classes.badge} style={{ backgroundColor: bgColor }}>
			{children}
		</div>
	);
};

export default Badge;
