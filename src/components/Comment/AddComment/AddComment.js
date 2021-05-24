import classes from "./AddComment.module.css";
import useForm from "../../../hooks/useForm";
import { addComment } from "../../../utils/formConfig";
import useHttp from "../../../hooks/useHttp";
import LoadingSpinner from "../../UI/LoadingSpinner/LoadingSpinner";
import { transformDataFromFirebase } from "../../../utils/transformFunctions";
import { useSelector } from "react-redux";

const AddComment = ({ locationId, authUserId, onAddComment }) => {
	const { formFields, formValid, setFormSubmitted, resetForm, formValue } = useForm({ formConfig: addComment });
	const { sendRequest , isLoading} = useHttp();
    const loggedInUser = useSelector(state => state.authentication.user)

	const addCommentHandler = (e) => {
		e.preventDefault();
		setFormSubmitted(true);

		if (formValid) {
			sendRequest(async () => {
				//SET NEW COMMENT TO DATABASE
				const response_setComment = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/comments/${locationId}.json?auth=${loggedInUser.idToken}`,
					{
						method: "POST",
						body: JSON.stringify({
							content: formValue["new-comment"],
							userId: authUserId,
							createdAt: new Date().getTime(),
						}),
					}
				);

				const data_setComment = await response_setComment.json();

				if (!response_setComment.ok)
					throw new Error(data_setComment.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				//GET ALL COMMENTS AFTER SET COMMENTS
				const response_getComments = await fetch(
					`https://react-food-map-default-rtdb.firebaseio.com/comments/${locationId}.json`
				);

				const data_getComments = await response_getComments.json();

				if (!response_getComments.ok)
					throw new Error(data_getComments.error.message || "SOMETHING WENT WRONG WHILE FETCHING");

				onAddComment(transformDataFromFirebase(data_getComments));
				resetForm();
			});
		}
	};
	return (
		<>
			<form className={classes["add-comment-form"]} onSubmit={addCommentHandler}>
				<div className={classes["form-fields-wrapper"]}>{formFields}</div>
				<div className={`form-action ${classes["form-actions"]}`}>
					<button className="btn" type="submit">
						Send
					</button>
				</div>
			</form>
            {isLoading && <LoadingSpinner />}
		</>
	);
};

export default AddComment;
