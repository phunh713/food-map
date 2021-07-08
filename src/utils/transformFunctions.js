export const removeAccents = (str) => {
	var AccentsMap = [
		"aàảãáạăằẳẵắặâầẩẫấậ",
		"AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ",
		"dđ",
		"DĐ",
		"eèẻẽéẹêềểễếệ",
		"EÈẺẼÉẸÊỀỂỄẾỆ",
		"iìỉĩíị",
		"IÌỈĨÍỊ",
		"oòỏõóọôồổỗốộơờởỡớợ",
		"OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ",
		"uùủũúụưừửữứự",
		"UÙỦŨÚỤƯỪỬỮỨỰ",
		"yỳỷỹýỵ",
		"YỲỶỸÝỴ",
	];
	for (var i = 0; i < AccentsMap.length; i++) {
		var re = new RegExp("[" + AccentsMap[i].substr(1) + "]", "g");
		var char = AccentsMap[i][0];
		str = str.replace(re, char);
	}
	return str.trim();
};

export const transformDataFromFirebase = (data) => {
	let transformedData = [];
	for (let key in data) {
		transformedData.push({ id: key, ...data[key] });
	}
	return transformedData;
};

export const getUniqueValue = (array) => {
	let uniqueValues = [];
	for (let item of array) {
		const index = uniqueValues.findIndex((value) => value === item);
		if (index === -1) uniqueValues.push(item);
	}
	return uniqueValues;
};

export const getFilterArrayByKeys = (array, compareObj) => {
	const compareKeys = Object.keys(compareObj);
	let resultArray = array;
	for (let key of compareKeys) {
		if (compareObj[key] === "all") {
			continue;
		}
		resultArray = resultArray.filter((item) => {
			if (item[key]) {
				return item[key] === compareObj[key];
			}
			return item.addressData[key] === compareObj[key];
		});
	}

	return resultArray;
};

export const getLocationUrl = (title, id) => {
	return `${removeAccents(title).trim().split(" ").join("-").toLowerCase()}-id${id}`;
};

export const getRenameDuplicateFile = (uploadFile, files) => {
	if (!files.length) return uploadFile.name;

	let duplicatedImgIdx = files.findIndex((f) => f.name === uploadFile.name);
	let newName = uploadFile.name;

	if (duplicatedImgIdx >= 0) {
		const type = "." + uploadFile.file.type.split("/")[1];
		newName = uploadFile.name.split(type)[0] + "-copy" + type;
        uploadFile.name = newName

		if (files.find((f) => f.name === newName)) {
			newName = getRenameDuplicateFile(uploadFile, files);
		}
	}

	return newName;
};
