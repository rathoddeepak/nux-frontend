import { perform } from "../request";

export const login = async ({ id, password }) => {
	return perform('hub/login', {		
		hubId: id,
		password,
	});
};

export const hubData = async (hubId) => {
	return perform('hub/data', {		
		hubId
	});
};

export const hubStreams = async (hubId) => {
	return perform('hub/hub_streams', {		
		hubId
	});
};

export const createHub = async ({ id, name, password, stationId }) => {
	return perform('hub/create_update_hub', {		
		id, name, password, stationId
	});
};

export const disableHub = async (hubId) => {
	return perform('hub/toggle_hub_status', {		
		hubId, isActive: false
	});
};

export const enableHub = async (hubId) => {
	return perform('hub/toggle_hub_status', {		
		hubId, isActive: true
	});
};

export const updateLayout = async ({ hubId, layout }) => {
	return perform('hub/update_layout', {		
		hubId, layout
	});
};

export const updateClasses = async ({ hubId, classes }) => {
	return perform('hub/update_classes', {		
		hubId, classes
	});
};

