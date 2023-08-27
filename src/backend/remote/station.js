import { perform } from "../request";

export const login = async ({ id, password }) => {
	return perform('station/login', {		
		stationId: id,
		password,
	});
};

export const stationData = async (stationId) => {
	return perform('station/data', {		
		stationId
	});
};

export const stationHubs = async (stationId) => {
	return perform('station/station_hubs', {		
		stationId
	});
};