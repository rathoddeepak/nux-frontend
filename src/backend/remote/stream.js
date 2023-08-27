import { perform } from "../request";

export const createStream = async ({ id, name, rtspUrl, hubId }) => {
	return perform('stream/create_update_stream', {		
		id, name, rtspUrl, hubId
	});
};

export const disableStream = async (streamId) => {
	return perform('stream/toggle_stream_status', {		
		streamId, isActive: false
	});
};

export const enableStream = async (streamId) => {
	return perform('stream/toggle_stream_status', {		
		streamId, isActive: true
	});
};

export const lastestStreamFrame = async (hubId) => {
	return perform('stream/latest_stream_frame', {		
		hubId
	});
};

export const updateStreamOrder = async (streamIds) => {
	return perform('stream/update_stream_order', {		
		streamIds
	});
};

export const streamData = async (streamId) => {
	return perform('stream/stream_data', {		
		streamId
	});
};

