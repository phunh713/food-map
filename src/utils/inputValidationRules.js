export const checkInputValid = (validation) => {
	if (!validation) {
		return {
			isValid: true,
			errorMessage: "",
		};
	}

	if (validation.type === "required") {
		return requiredRule(validation.value);
	}

	if (validation.type === "email") {
		return emailRule(validation.value);
	}

	if (validation.type === "minLength") {
		return minLengthRule(validation.value, validation.config);
	}

	if (validation.type === "password_match") {
		return passwordMatch(validation.value, validation.config);
	}

	if (validation.type === "stringIncludes") {
		return stringIncludes(validation.value, validation.config);
	}

	if (validation.type === "validAddress") {
		return addressValidRule(validation.value);
	}
};

const valueIsValid = { isValid: true, errorMessage: null };

const requiredRule = (value) => {
	let validateValue = typeof value === "string" ? value.trim() : value;

	if (validateValue.length) {
		return valueIsValid;
	} else {
		return {
			isValid: false,
			errorMessage: "This Field is Required",
		};
	}
};

const emailRule = (value) => {
	const re =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if (re.test(value.toLowerCase())) {
		return valueIsValid;
	} else {
		return {
			isValid: false,
			errorMessage: "Please enter a valid Email",
		};
	}
};

const minLengthRule = (value, config) => {
	if (value.length >= config) {
		return valueIsValid;
	} else {
		return {
			isValid: false,
			errorMessage: "This Field requires at least 6 Characters",
		};
	}
};

const passwordMatch = (value, config) => {
	if (value === config) {
		return valueIsValid;
	} else {
		return {
			isValid: false,
			errorMessage: "Password not Match",
		};
	}
};

const addressValidRule = (value) => {
	if (value) return valueIsValid;

	return {
		isValid: false,
		errorMessage: "Please select address from dropdown menu",
	};
};

export const stringIncludes = (value, config) => {
	if (value.includes(config)) {
		return valueIsValid;
	} else {
		return {
			isValid: false,
			errorMessage: `Please enter ${config} address only!`,
		};
	}
};
