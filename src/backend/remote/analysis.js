import { perform } from "../request";

export const loadFrames = async ({ streamId, offset = 0, dateFrom, dateTo }) => {
	return perform('analysis/load_frames', {		
		streamId, offset, dateFrom, dateTo
	});
};
