import { useCallback, useMemo, useState } from "react";
import LocationSearch from "../components/Locations/LocationSearch/LocationSearch";
import { checkInputValid } from "../utils/inputValidationRules";

const useLocationSearchForm = (required, editValue = null) => {
	const initialConfig = useMemo(() => {
		return {
			value: editValue?.full_address || "",
			isTouched: !!editValue || false,
			isValid: !!editValue || !required,
			errorMessage: "This Field is Required",
			validation: [
				{ type: "required", config: null },
				{ type: "stringIncludes", config: "Vietnam" },
			],
			addressData: editValue || null,
		};
	}, [editValue, required]);

	const [form, setForm] = useState({ ...initialConfig });
	const [isFormSubmitted, setIsFormSubmitted] = useState(false);

	const onChangeHandler = (dataObj) => {
		let validateResult;
        console.log(dataObj)
		if (required) {
			for (let validation of form.validation) {
				validateResult = checkInputValid({ ...validation, value: dataObj.value });
				if (!validateResult.isValid) break;
			}
		}

		setForm({
			...form,
			value: dataObj.value,
			isTouched: true,
			isValid: validateResult.isValid,
			errorMessage: validateResult.errorMessage,
			addressData: dataObj.addressData,
		});
	};

	const searchField = (
		<LocationSearch
			onChange={onChangeHandler}
			value={form.value}
			isTouched={form.isTouched}
			isValid={form.isValid}
			isFormSubmitted={isFormSubmitted}
			errorMessage={form.errorMessage}
		/>
	);

	const resetForm = useCallback(() => {
		setIsFormSubmitted(false);
		setForm({ ...initialConfig, value: "", isTouched: false, isValid: !required, addressData: null });
	}, [setIsFormSubmitted, setForm, initialConfig, required]);

	const searchValid = form.isValid;
	const searchValue = { addressData: form.addressData };

	return { searchField, resetForm, setIsFormSubmitted, searchValue, searchValid };
};

export default useLocationSearchForm;
