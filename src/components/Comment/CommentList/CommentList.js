import classes from "./CommentList.module.css";
import CommentItem from "./CommentItem/CommentItem";
import React from 'react'

const CommentList = ({ comments }) => {
	const sortedComments = comments.sort((a, b) => {
		return b.createdAt - a.createdAt;
	});

	return (
		<div className={classes['comment-list-wrapper']}>
            <h2>All Comments ({comments.length})</h2>
			{sortedComments.map((comment) => (
				<CommentItem comment={comment} key={comment.id}/>
			))}
		</div>
	);
};

export default React.memo(CommentList);
