//Form Config requirements: label, id, value, isValid, errorMessage, type, isTouched, (validation: [{type,config}] | null)

const setFormFieldDefault = (label, id, type, otherTypeConfig = null) => {
	if (type === "textarea") {
		return {
			label,
			id,
			type,
			value: "",
			isTouched: false,
			textareaRow: otherTypeConfig.row,
			textareaCol: otherTypeConfig.col,
		};
	}

	if (type === "select") {
		return { label, id, type, value: "", isTouched: false, selectOptions: otherTypeConfig.options };
	}

	return { label, id, type, value: "", isTouched: false };
};

const setFormFieldValidation = (data) => {
	if (!data) return { isValid: true };

	return {
		isValid: false,
		errorMessage: "This Field is Required",
		validation: data,
	};
};

export const loginFormConfig = [
	{
		...setFormFieldDefault("Your Email", "email", "text"),
		...setFormFieldValidation([
			{ type: "required", config: null },
			{ type: "email", config: null },
		]),
	},
	{
		...setFormFieldDefault("Password", "password", "password"),
		...setFormFieldValidation([
			{ type: "required", config: null },
			{ type: "minLength", config: 6 },
		]),
	},
];

export const signupFormConfig = [
	{
		...setFormFieldDefault("Your Email", "email", "text"),
		...setFormFieldValidation([
			{ type: "required", config: null },
			{ type: "email", config: null },
		]),
	},
	{
		...setFormFieldDefault("Your Username", "username", "text"),
		...setFormFieldValidation([{ type: "required", config: null }]),
	},
	{
		...setFormFieldDefault("Password", "password", "password"),
		...setFormFieldValidation([
			{ type: "required", config: null },
			{ type: "minLength", config: 6 },
		]),
	},
	{
		...setFormFieldDefault("Confirm Password", "password_match", "password"),
		...setFormFieldValidation([
			{ type: "required", config: null },
			{ type: "password_match", config: null },
		]),
	},
];

export const addLocationFromConfig = [
	{
		...setFormFieldDefault("Location Type", "type", "select", {
			options: ["", "Cơm Tấm", "Bún Bò", "Hủ Tiếu", "Phở", "Bánh Canh", "Mì Quảng", "Lẩu", "Ốc"],
		}),
		...setFormFieldValidation([{ type: "required", config: null }]),
	},
	{
		...setFormFieldDefault("Location Title", "title", "text"),
		...setFormFieldValidation([{ type: "required", config: null }]),
	},
	{
		placeholder: "address",
	},
	// {
	// 	placeholder: "images",
	// },
	{
		placeholder: "imagesUpload",
	},
	{
		...setFormFieldDefault("Note", "note", "textarea", { row: 10 }),
		...setFormFieldValidation(),
	},
];

export const setEditFormConfig = (formConfig, editObj) => {
	let editFormConfig = [...formConfig];

	for (let key in editObj) {
		const index = formConfig.findIndex((configItem) => configItem.id === key);
		editFormConfig[index] = { ...editFormConfig[index], value: editObj[key], isValid: true, isTouched: true };
	}

	return editFormConfig;
};

export const imageFormGroup = [
	{
		...setFormFieldDefault("Images URLs", "image_url", "text"),
		...setFormFieldValidation([{ type: "required", config: null }]),
	},
];

export const editUserProfile = [
	{
		...setFormFieldDefault("Your Username", "username", "text"),
		...setFormFieldValidation([{ type: "required", config: null }]),
	},
	{
		...setFormFieldDefault("Your Avatar", "avatar", "text"),
		...setFormFieldValidation(),
	},
	{
		...setFormFieldDefault("Your Gender", "gender", "select", { options: ["", "Male", "Female", "LGBT"] }),
		...setFormFieldValidation(),
	},
	{
		...setFormFieldDefault("Your Bio", "biography", "textarea", { textareaRow: 3 }),
		...setFormFieldValidation(),
	},
];

export const addComment = [
	{
		...setFormFieldDefault("Add new comment", "new-comment", "textarea", { textareaRow: 3 }),
		...setFormFieldValidation([{ type: "required", config: null }]),
	},
];

export const cityFilter = (cities) => {
	return [
		{
			...setFormFieldDefault("City", "city", "select", { options: cities }),
			...setFormFieldValidation(),
		},
	];
};

export const districtFilter = (districts) => {
	return [
		{
			...setFormFieldDefault("District", "district", "select", { options: districts }),
			...setFormFieldValidation(),
		},
	];
};
