import { API_URL } from "../utils/constants";

async function perform(code, details, auth = true) {
	const url = API_URL + code;
	return (
		fetch(url, {
			method: "POST",
			timeout: 4000,
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify(details),
		})
			//.then((response) => response.json())
			.then((response) => response.text())
			.then((res) => {
				console.log(res);
				return JSON.parse(res);
				//return res;
			})
			.catch((error) => {
				console.log(error);
				return false;
			})
	);
}

async function multipartUpload(code, details, file, auth = true) {
	const formData = new FormData();
	for (var key in details) {
		formData.append(key, details[key]);
	}
	formData.append("file", file);
	return (
		fetch(API_URL + code, {
			method: "POST",
			timeout: 4000,
			body: formData
		})
			//.then((response) => response.json())
			.then((response) => response.text())
			.then((res) => {
				console.log(res);
				return JSON.parse(res);
				//return res;
			})
			.catch((error) => {
				console.log(error);
				return false;
			})
	);
}

export { multipartUpload, perform };