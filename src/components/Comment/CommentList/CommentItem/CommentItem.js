import { useEffect } from "react";
import useHttp from "../../../../hooks/useHttp";
import classes from "./CommentItem.module.css";

const CommentItem = ({ comment }) => {
	const { sendRequest, data } = useHttp(true);
	const contentWithBreak = comment.content.split("\n").map((line, i) => (
		<span key={i}>
			{line}
			<br />
		</span>
	));

	const d = new Date(comment.createdAt);
	const formatDate = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}, ${d.getHours()}:${d.getMinutes()}`;

	useEffect(() => {
		sendRequest(async () => {
			const response = await fetch(
				`https://react-food-map-default-rtdb.firebaseio.com/users/${comment.userId}.json`
			);
			const data = (await response).json();

			if (!response.ok) throw new Error(data.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

			return data;
		});
	}, [sendRequest, comment.userId]);
	return (
		data && (
			<div className={classes["comment-wrapper"]}>
				<img src={data.avatar} alt="user avatar"/>
				<div className={classes.content}>
					<div className={classes["user-info"]}>
						<h3>{data.username}</h3>
						<span>{formatDate}</span>
					</div>
					<p>{contentWithBreak}</p>
				</div>
			</div>
		)
	);
};

export default CommentItem;
