import React from "react";
import { IoMdClose } from "react-icons/io";
import classes from "./UploadFormControl.module.css";

function UploadFormControl({
	images,
	multiple,
	handleOnChange,
	handleOnBlur,
	isValid,
	isTouched,
	formSubmitted,
	handleRemoveImg,
}) {
	return (
		<div className="form-control">
			<label htmlFor="imageUpload">Upload Images</label>
			<input
				type="file"
				multiple={multiple}
				accept="image/*"
				onChange={handleOnChange}
				onBlur={handleOnBlur}
				id="imageUpload"
			/>
			{!isValid && (isTouched || formSubmitted) && <span className="error">Please choose at least 1 image</span>}
			{images && (
				<div className={classes["preview-wrapper"]}>
					{images.map((image) => (
						<div key={image.name || image.image_url} className={classes["img-wrapper"]}>
							<div className={classes["close-btn"]} onClick={() => handleRemoveImg(image)}>
								<IoMdClose color="#fff" />
							</div>
							{<img src={image.localUrl || image["image_url"]} alt={image.name} />}
						</div>
					))}
				</div>
			)}
		</div>
	);
}

export default UploadFormControl;
