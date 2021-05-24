import { useState } from "react";

const FormControl = ({
	index,
	label,
	id,
	name,
	isValid,
	isSubmitted,
	errorMessage,
	type,
	onChange,
	validation,
	value,
	isTouched,
	selectOptions,
	textareaRow,
	textareaCol,
}) => {
	const [isTyping, setIsTyping] = useState(false);
	const onChangeHandler = (e) => {
		onChange({ id, name, value: e.target.value, index });
		setIsTyping(true);
	};
	const onBlurHandler = (e) => {
		onChange({ id, name, value: e.target.value, index });
		setIsTyping(false);
	};

	let inputElement = <input id={id} type={type} onChange={onChangeHandler} onBlur={onBlurHandler} value={value} />;

	if (type === "textarea") {
		inputElement = (
			<textarea
				id={id}
				rows={textareaRow}
				cols={textareaCol}
				onChange={onChangeHandler}
				onBlur={onBlurHandler}
				value={value}
			></textarea>
		);
	}

	if (type === "select") {
		inputElement = (
			<select id={id} onChange={onChangeHandler} onBlur={onBlurHandler} value={value}>
				{selectOptions.map((option) => (
					<option key={option} value={option}>
						{!option ? "Please Select an option" : option}
					</option>
				))}
			</select>
		);
	}

	return (
		<div className={`form-control ${id}`}>
			<label htmlFor={id}>{id.includes("img") ? index + 1 : label}</label>
			{inputElement}
			{validation && (isTouched || isSubmitted) && !isTyping && !isValid && (
				<span className="error">{errorMessage}</span>
			)}
		</div>
	);
};

export default FormControl;
