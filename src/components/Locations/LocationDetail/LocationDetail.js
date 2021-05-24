import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect, useParams } from "react-router";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import useHttp from "../../../hooks/useHttp";
import { transformDataFromFirebase } from "../../../utils/transformFunctions";
import AddComment from "../../Comment/AddComment/AddComment";
import CommentList from "../../Comment/CommentList/CommentList";
import Rating from "../../Rating/Rating/Rating";
import RatingSummary from "../../Rating/RatingSummary/RatingSummary";
import Badge from "../../UI/Badge/Badge";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";
import User from "../../UI/User/User";
import classes from "./LocationDetail.module.css";

const sliderSettings = {
	dots: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	slidesToScroll: 1,
};

const LocationDetail = () => {
	const { id } = useParams();
	const { locations } = useSelector((state) => state.location);
	const { user } = useSelector((state) => state.authentication);

	const { sendRequest, isLoading } = useHttp(true);

	const [ratingData, setRatingData] = useState([]);
	const [rating, setRating] = useState(-1);
	const [allComments, setAllComments] = useState(null);

	const [userInfo, setUserInfo] = useState(null);

	const locationId = id.split("id")[1];
	const locationById = locations.find((location) => location.id === locationId);

	const clickRatingHandler = (rating) => {
		setRating(rating);
	};

	const clickAddCommentHandler = (data) => {
		setAllComments(data);
	};

	const noteWithBreak = locationById?.note.split("\n").map((line, i) => (
		<span key={i}>
			{line}
			<br />
		</span>
	));

	useEffect(() => {
		if (locationById) {
			sendRequest(async () => {
				const request_getRating = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/rating/${locationById.id}.json`
				);
				const data_getRating = await request_getRating.json();

				if (!request_getRating.ok) {
					throw new Error(data_getRating.error || "SOMETHING WENT WRONG WHILE FETCHING");
				}

				setRatingData(data_getRating);
			});
		}
	}, [rating, locationById, locationId, sendRequest]);

	useEffect(() => {
		if (locationById) {
			sendRequest(async () => {
				const request_getUser = fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/users/${locationById.userId}.json`
				);

				const [response_getUser] = await Promise.all([request_getUser]);
				const [data_getUser] = await Promise.all([response_getUser.json()]);

				if (!response_getUser.ok) {
					throw new Error(data_getUser.error || "SOMETHING WENT WRONG WHILE FETCHING");
				}

				setUserInfo(data_getUser);
			});
		}
	}, [locationById, locationId, sendRequest]);

	useEffect(() => {
		if (locationById) {
			sendRequest(async () => {
				const request_getAllComments = fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/comments/${locationId}.json`
				);

				const [response_getAllComments] = await Promise.all([request_getAllComments]);
				const [data_getAllComments] = await Promise.all([response_getAllComments.json()]);

				if (!response_getAllComments.ok) {
					throw new Error(data_getAllComments.error || "SOMETHING WENT WRONG WHILE FETCHING");
				}

				const transformed_data_getAllComments = transformDataFromFirebase(data_getAllComments);
				setAllComments(transformed_data_getAllComments);
			});
		}
	}, [locationById, locationId, sendRequest]);

	if (!locationById) return <Redirect to="/not-found" />;

	return (
		allComments &&
		ratingData !== [] &&
		userInfo && (
			<>
				<div className={classes["location-detail-wrapper"]}>
					<Slider {...sliderSettings}>
						{locationById.images.map((image) => (
							<div key={image.image_url} className={classes["image-wrapper"]}>
								<img src={image.image_url} alt="" />
							</div>
						))}
					</Slider>

					<div className={classes["location-detail-info-wrapper"]}>
						<div className={classes.title}>
							<Badge type={locationById.type}>{locationById.type}</Badge>
							{locationById.title}
						</div>
						<div className={classes.address}>{locationById.addressData.full_address}</div>
						<div className={classes["submit-info"]}>
							<User username={userInfo.username} avatar={userInfo.avatar} />
							<span style={{ marginLeft: 5 }}>
								submitted this location{" "}
								{locationById.createdAt && `on ${new Date(locationById.createdAt).toDateString()}`}{" "}
								{locationById.note && "with a note"}
							</span>
						</div>
						{locationById.note && <div className={classes.note}>{noteWithBreak}</div>}
						<div>
							<RatingSummary ratingData={ratingData} />
						</div>
						{user && <Rating id={locationById.id} ratingData={ratingData} onRate={clickRatingHandler} />}
					</div>
				</div>

				{!user && (
					<div className={classes["login-note"]}>
						Kindly <Link to={{ pathname: "/login", search: `?returnUrl=/locations/${id}` }}>Log In</Link> to
						Rate and Leave a Comment for this Location
					</div>
				)}

				{user && (
					<div className={classes["location-detail-add-comment-wrapper"]}>
						<AddComment
							locationId={locationId}
							authUserId={user.localId}
							onAddComment={clickAddCommentHandler}
						/>
					</div>
				)}

				<div className={classes["location-detail-all-comments-wrapper"]}>
					<CommentList comments={allComments} />
				</div>
				{isLoading && <LoadingSpinner />}
			</>
		)
	);
};

export default LocationDetail;
