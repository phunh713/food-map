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
	return str;
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
	return `${removeAccents(title).replace(" ", "-").toLowerCase()}-id${id}`;
};
