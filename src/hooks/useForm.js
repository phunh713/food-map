import { useCallback, useState } from "react";
import FormControl from "../components/UI/Form/FormControl/FormControl";
import { checkInputValid } from "../utils/inputValidationRules";

const useForm = (formObj, customInputArray = null) => {
	const getCopiedConfigArray = useCallback(() => {
		let copiedArr = [];
		for (let item of formObj.formConfig) {
			copiedArr.push({ ...item });
		}
		return copiedArr;
	}, [formObj.formConfig]);

	let formState = getCopiedConfigArray();
	if (formObj.editValue) {
		for (let key in formObj.editValue) {
			let foundField = formState.find((field) => field.id === key);
			foundField.value = formObj.editValue[key];

            //Edit được --> field valid va touched
			foundField.isValid = true;
			foundField.isTouched = true;
		}
	}

	const [form, setForm] = useState(formState);
	const [formSubmitted, setFormSubmitted] = useState(false);

	const onChangeHandler = (dataObj) => {
		//dataObj lấy từ onChangeHandler của Input trong Form Control Component
		const focusedInput = { ...form.find((item) => item.id === dataObj.id) }; //tìm và copy input object của input mà user đang nhập
		const index = form.findIndex((item) => item.id === dataObj.id); //tìm index của input mà user đang nhập

		focusedInput.value = dataObj.value;
		focusedInput.isTouched = true;

		if (focusedInput.validation) {
			let validationCheck;
			for (let validation of focusedInput.validation) {
				const validData =
					validation.type === "password_match"
						? {
								...validation,
								value: dataObj.value, //lấy value của password_match
								config: form.find((item) => item.id === "password").value, //lấy value của password từ form để so sánh với password_match
						  }
						: { ...validation, value: dataObj.value };

				validationCheck = checkInputValid(validData);

				if (!validationCheck.isValid) break; //nếu bắt gặp input đầu tiên KHÔNG valid thì break khỏi vòng lặp, và lấy data (errorMessage, isValid) của input đó
			}

			focusedInput.errorMessage = validationCheck.errorMessage;
			focusedInput.isValid = validationCheck.isValid;
		}

		let updatedForm = [...form];
		updatedForm[index] = focusedInput;
		setForm(updatedForm);
	};

	const resetForm = useCallback(() => {
		setForm(getCopiedConfigArray());
		setFormSubmitted(false);
	}, [setForm, setFormSubmitted, getCopiedConfigArray]);

	const formFields = form.map((input, index) => {
		if (!input.placeholder) {
			return (
				<FormControl
					index={index}
					key={input.id}
					onChange={onChangeHandler}
					//OMIT IF DONT NEED VALIDATION
					validation={input.validation}
					//always TRUE if field dont need validation
					isValid={input.isValid}
					isTouched={input.isTouched}
					isSubmitted={formSubmitted}
					errorMessage={input.errorMessage}
					//MANUALLY INPUT, REQUIRED
					label={input.label}
					id={input.id}
					type={input.type}
					value={input.value}
					classes={input.classes}
					selectOptions={input.selectOptions}
					textareaCol={input.textareaCol}
					textareaRow={input.textareaRow}
				/>
			);
		} else {
			return customInputArray.find((customInput) => customInput.id === input.placeholder).input;
		}
	});

	let formValid = true;
	for (let item of form) {
		if (!item.isValid && !item.placeholder) {
			formValid = false;
			break;
		}
	}

	const formValue = form.reduce((obj, item) => {
		if (!item.placeholder) {
			return { ...obj, [item.id]: item.value };
		} else {
			return obj;
		}
	}, {});

	return { formFields, formValid, setFormSubmitted, resetForm, formValue };
};

export default useForm;
