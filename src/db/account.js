import { setCookie, deleteCookie, getCookie } from "./cookie";

function setStationId(token) {
	try {
		setCookie('sid', token, 10);
	}catch(err){
		console.log(err);
		return false;
	}
}

function getStationId() {
	try {
		return getCookie('sid');		
	}catch(err){
		console.log(err);
		return false;
	}	
}

function deleteStationId() {
	try {
		return deleteCookie('sid');
	}catch(err){
		console.log(err);
		return true;
	}
}

function setHubId(token) {
	try {
		setCookie('hid', token, 10);
	}catch(err){
		console.log(err);
		return false;
	}
}

function getHubId() {
	try {
		return getCookie('hid');		
	}catch(err){
		console.log(err);
		return false;
	}	
}

function deleteHubId() {
	try {
		return deleteCookie('hid');
	}catch(err){
		console.log(err);
		return true;
	}
}


const modules = {
	setStationId,
	getStationId,
	deleteStationId,
	setHubId,
	getHubId,
	deleteHubId,
}

export default modules;