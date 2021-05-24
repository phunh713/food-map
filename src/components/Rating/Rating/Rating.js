import star from "../../../assets/images/star.png";
import emptyStar from "../../../assets/images/star-empty.png";
import classes from "./Rating.module.css";
import useHttp from "../../../hooks/useHttp";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";

const setRatingArr = (ratingNo) => {
	let arr = [];
	for (let i = 0; i < ratingNo; i++) {
		arr.push(star);
	}
	for (let i = 0; i < 5 - ratingNo; i++) {
		arr.push(emptyStar);
	}

	return arr;
};

//COMPONENT FUNCTION
const Rating = ({ id, onRate, ratingData }) => {
	const { user } = useSelector((state) => state.authentication);
	const { sendRequest, isLoading } = useHttp();

	let ratingImg = setRatingArr(0);
	let pastRating = 0;

	if (ratingData) {
		for (let item of ratingData) {
			//Find if user has rated or not
			const index = item.users?.findIndex((userId) => userId === user.localId);

			//if user rated, set stars Array and past rating
			if (index > -1) {
				ratingImg = setRatingArr(item.rating);
				pastRating = item.rating;
				break;
			}
		}
	}

	const clickHandler = (index) => {
		if (+pastRating !== +index + 1) {
			let copiedRatingArray;

			let ratingObj = {
				rating: index + 1,
				users: [user.localId],
			};

			if (ratingData) {
				copiedRatingArray = [...ratingData];

				//
				const addIndex = copiedRatingArray.findIndex((item) => +item.rating === +index + 1);
				if (+addIndex > -1 && copiedRatingArray[+addIndex].users) {
					copiedRatingArray[+addIndex] = {
						rating: copiedRatingArray[+addIndex].rating,
						users: [...copiedRatingArray[+addIndex].users, ...ratingObj.users],
					};
				} else if (+addIndex > -1 && !copiedRatingArray[+addIndex].users) {
					copiedRatingArray[+addIndex] = {
						rating: copiedRatingArray[+addIndex].rating,
						users: ratingObj.users,
					};
				} else {
					copiedRatingArray.push(ratingObj);
				}

				const removeIndex = copiedRatingArray.findIndex((item) => +item.rating === +pastRating);
				if (removeIndex > -1 && copiedRatingArray[+removeIndex].users) {
					copiedRatingArray[+removeIndex] = {
						rating: copiedRatingArray[+removeIndex].rating,
						users: copiedRatingArray[+removeIndex].users.filter((item) => item !== user.localId),
					};
				}
			} else {
				copiedRatingArray = [ratingObj];
			}

			sendRequest(async () => {
				const response = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/rating/${id}.json?auth=${user.idToken}`,
					{
						method: "PUT",
						body: JSON.stringify(copiedRatingArray),
					}
				);
				const data = await response.json();

				if (!response.ok) throw new Error(data.error || "SOMETHING WENT WRONG WHILE FETCHING");

				onRate(index + 1);
			});
		}
	};

	return (
		<div className={classes.rating}>
			<span>{pastRating ? `You've Rated this Location (${pastRating}/5):` : "Kindly Rate this Location: "}</span>
			<div className={classes['stars-wrapper']}>
				{ratingImg.map((img, index) => (
					<img src={img} alt="rating stars" key={index} onClick={() => clickHandler(index)} />
				))}
			</div>
			<span className={classes["rating-note"]}>(Click the stars to rate)</span>
			{isLoading && <LoadingSpinner />}
		</div>
	);
};

export default Rating;
