import classes from "./RatingSummary.module.css";

const RatingSummary = ({ ratingData }) => {
	const totalRating = ratingData?.reduce((total, item) => total + (item.users?.length || 0) * item.rating, 0) || 0;
	const totalRater = ratingData?.reduce((total, item) => total + (item.users?.length || 0), 0) || 0;

	const newRatingData =
		ratingData?.map((item) => {
			return { rating: item.rating, raterPercentage: (item.users?.length / totalRater) * 100 || 0 };
		}) || [];

	let detailSummary = [];

	for (let i = 5; i > 0; i--) {
		const foundRating = newRatingData.find((item) => +item.rating === i);
		detailSummary.push(
			<div key={i} className={classes["percent-wrapper"]}>
				<div className={classes.percent}>
					<div style={{ width: `${foundRating?.raterPercentage || 0}%` }}></div>
				</div>
				<span>
					{i} {i !== 1 ? "stars" : "star"}
				</span>
			</div>
		);
	}

	return (
		<div className={classes["rating-summary-wrapper"]}>
			<div className={classes["summary-total"]}>
				<span className={classes["average-rating"]}>
					{totalRating / totalRater ? (totalRating / totalRater).toFixed(1) : 0}
				</span>
				<span className={classes["total-raters"]}>{totalRater} Votes</span>
			</div>
			<div className={classes["summary-detail"]}>{detailSummary}</div>
		</div>
	);
};

export default RatingSummary;
