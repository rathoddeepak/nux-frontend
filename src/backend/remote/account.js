import { perform } from "../request";

export const stationLogin = async ({ id, password }) => {
	return perform('station/login', {		
		id,
		password,
	});
};

export const hubLogin = async ({ id, password }) => {
	return perform('hub/login', {		
		id,
		password
	});
};