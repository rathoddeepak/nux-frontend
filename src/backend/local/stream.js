import goRequest from "./goRequest";

export const uuid = (id) => {
	return `stream_${id}`;
};

export const addStream = async ({ uuid, name, rtspUrl }) => {
	const payload = {
		uuid,
		name,
		channels: {
			0: {
				url: rtspUrl,
				on_demand: false,
				debug: false,
			},
		},
	};
	return goRequest("add", uuid, payload);
};

export const editStream = async ({ uuid, name, rtspUrl }) => {
	const payload = {
		uuid,
		name,
		channels: {
			0: {
				url: rtspUrl,
				on_demand: false,
				debug: false,
			},
		},
	};
	const response = await goRequest("edit", uuid, payload);
	await reloadStream(uuid);
	return response;
};

export const deleteStream = async (uuid) => {
	return goRequest("delete", uuid);
};

export const reloadStream = async (uuid) => {
	return goRequest("reload", uuid);
};

export const streamInfo = async (uuid) => {
	return goRequest("info", uuid);
};

export const allStreams = async () => {
	const streams = await goRequest("streams");
	const finalStreams = [];
	if (streams.status === 1) {
		const uuids = Object.keys(streams.payload || {});
		for (let uuid of uuids) {
			const data = streams.payload[uuid];
			if(data){
				finalStreams.push({
					uuid,
					...data
				});
			}			
		}
	}
	return finalStreams;
};