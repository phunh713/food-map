import classes from "./Badge.module.css";

const Badge = ({ children, type }) => {
    let bgColor;

    if (type === "Bún Bò") bgColor = "#ee2756"
    if (type === "Cơm Tấm") bgColor = "#32a9d7"
	return (
		<div className={classes.badge} style={{ backgroundColor: bgColor }}>
			{children}
		</div>
	);
};

export default Badge;
