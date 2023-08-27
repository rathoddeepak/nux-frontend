const goRequest = async (method, uuid, data) => {
	data = data || null;
	uuid = uuid || null;
	var path = "";
	var type = "GET";
	switch (method) {
		case "add":
			path = "/stream/" + uuid + "/add";
			type = "POST";
			break;
		case "edit":
			path = "/stream/" + uuid + "/edit";
			type = "POST";
			break;
		case "delete":
			path = "/stream/" + uuid + "/delete";
			break;
		case "reload":
			path = "/stream/" + uuid + "/reload";
			break;
		case "info":
			path = "/stream/" + uuid + "/info";
			break;
		case "streams":
			path = "/streams";
			break;
		default:
			path = "";
			type = "GET";
	}
	if (path === "") {
		return false;
	}
	const url = `http://localhost:8083${path}`;
	let payload = {};
	if (data) {
		payload = {
			body: JSON.stringify(data),
		};
	}
	return fetch(url, {
		method: type,
		timeout: 4000,
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		...payload,
	})
		.then((response) => response.json())
		.then((res) => {
			return res;
		})
		.catch((error) => {
			console.log(error);
			return false;
		});
};

export default goRequest;