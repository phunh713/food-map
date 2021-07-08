import { useState } from "react";
import { getRenameDuplicateFile } from "../utils/transformFunctions";
import UploadFormControl from "../components/UI/Form/UploadFormControl/UploadFormControl";

const useUploadImages = (multiple = true, editValue = []) => {
	const [images, setImages] = useState(editValue);
	const [formSubmitted, setFormSubmitted] = useState(false);
	const [isTouched, setIsTouched] = useState(false);
	const [isValid, setIsValid] = useState(!!editValue.length);

	const handleOnChange = (e) => {
		setIsTouched(true);
		let uploadFiles = Array.from(e.target.files).map((file) => {
			return { name: file.name, file };
		});

		uploadFiles = uploadFiles.map((file) => {
			return { ...file, name: getRenameDuplicateFile(file, images) };
		});

		setIsValid(!![...images, ...uploadFiles].length);

		Promise.all(
			uploadFiles.map((image) => {
				const promise = new Promise((resolve, reject) => {
					const reader = new FileReader();
					reader.readAsDataURL(image.file);
					reader.addEventListener("load", (e) => {
						resolve({ ...image, localUrl: e.target.result });
					});
					reader.addEventListener("error", () => reject);
				});
				return promise;
			})
		)
			.then((uploadImages) => {
				setImages([...images, ...uploadImages]);
			})
			.catch((err) => console.log(err));
	};

	const handleOnBlur = () => {
		setIsTouched(true);
		setIsValid(!!images.length);
	};

	const handleRemoveImg = (imageObj) => {
		const updateImages = images.filter((img) => {
			if (imageObj.name) return img.name !== imageObj.name;
			return img.image_url !== imageObj.image_url;
		});
		setImages(updateImages);
		setIsValid(!!updateImages.length);
	};

	const formField = (
		<UploadFormControl
			multiple={multiple}
			images={images}
			isTouched={isTouched}
			isValid={isValid}
			formSubmitted={formSubmitted}
			handleOnBlur={handleOnBlur}
			handleOnChange={handleOnChange}
			handleRemoveImg={handleRemoveImg}
		/>
	);

	return { formField, setFormSubmitted, images, isValid };
};

export default useUploadImages;
