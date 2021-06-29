import { useCallback, useState } from "react";
import FormControl from "../components/UI/Form/FormControl/FormControl";
import { checkInputValid } from "../utils/inputValidationRules";

const useDynamicForm = (dynamicFormObj, dynamicFormName) => {
	//copy deep the DynamicFormConfig

	const getcopiedDynamicFormConfig = useCallback(() => {
		let copiedDynamicFormConfig = [];
		for (let item of dynamicFormObj.formConfig) {
			copiedDynamicFormConfig.push({ ...item });
		}
		return copiedDynamicFormConfig;
	}, [dynamicFormObj.formConfig]);

	let formState = [getcopiedDynamicFormConfig()];
    
	if (dynamicFormObj.editValue) {
		formState = [];
		for (let valueObj of dynamicFormObj.editValue) {
			let dynamicForm = getcopiedDynamicFormConfig();
			for (let key in valueObj) {
				let foundField = dynamicForm.find((field) => field.id === key);
				foundField.value = valueObj[key];
				foundField.isValid = true;
				foundField.isTouched = true;
			}
			formState = [...formState, dynamicForm];
		}
	}

	const [form, setForm] = useState(formState);
	const [formSubmitted, setFormSubmitted] = useState(false);

	const onChangeHandler = (dataObj) => {
		let copiedForm = form.slice();
		let copiedGroup = copiedForm[dataObj.index];
		let copiedField = copiedGroup.find((item) => item.id === dataObj.name);

		// set data
		copiedField.value = dataObj.value;
		copiedField.isTouched = true;

		if (copiedField.validation) {
			let validResult;
			for (let validation of copiedField.validation) {
				validResult = checkInputValid({ ...validation, value: copiedField.value });
				if (!validResult.isValid) break;
			}
			copiedField.isValid = validResult.isValid;
			copiedField.errorMessage = validResult.errorMessage;
			setForm(copiedForm);
		}
	};

	const addFormGroupHandler = () => {
		setForm((prev) => [...prev, getcopiedDynamicFormConfig()]);
	};

	const removeFormGroupHandler = (index) => {
		setForm((prev) => {
			if (prev.length === 1) return prev;
			let copied = [...prev];
			copied.splice(index, 1);
			return copied;
		});
	};

	const formFields = (
		<>
			{form.map((group, index) => {
				return (
					<div className="form-group" key={index}>
						{group.map((item) => {
							return (
								<FormControl
									index={index}
									isSubmitted={formSubmitted}
									onChange={onChangeHandler}
									key={item.id}
									label={item.label}
									id={`${item.id}${index}`}
									name={item.id}
									validation={item.validation}
									isValid={item.isValid}
									isTouched={item.isTouched}
									value={item.value}
									errorMessage={item.errorMessage}
									type={item.type}
									inputType={item.inputType}
									selectOptions={item.selectOptions}
									textareaCol={item.textareaCol}
									textareaRow={item.textareaRow}
								/>
							);
						})}
						<button type="button" onClick={addFormGroupHandler} style={{ marginRight: 10 }}>
							+
						</button>
						<button type="button" onClick={() => removeFormGroupHandler(index)}>
							-
						</button>
					</div>
				);
			})}
		</>
	);

	let formValid = true;
	for (let item of form) {
		for (let child of item) {
			if (!child.isValid) {
				formValid = false;
				break;
			}
		}
	}

	const getArrayValue = (array) =>
		array.reduce((obj, item) => {
			return { ...obj, [item.id]: item.value };
		}, {});

	const formValue = {
		[dynamicFormName]: form.reduce((arr, item) => {
			return [...arr, getArrayValue(item)];
		}, []),
	};

	const resetForm = useCallback(() => {
		setForm([getcopiedDynamicFormConfig()]);
		setFormSubmitted(false);
	}, [setForm, setFormSubmitted, getcopiedDynamicFormConfig]);

	return { formFields, setFormSubmitted, formValue, formValid, resetForm };
};

export default useDynamicForm;
