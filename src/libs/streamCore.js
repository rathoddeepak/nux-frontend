import Stream from "./stream";

class Streams {
	constructor(){
		this.streams = {};
	}

	addStream = (streamID) => {
		const streamAdded = this.streams[streamID];
		if(!streamAdded){
			this.streams[streamID] = new Stream(streamID);
			this.streams[streamID].init();
		}		
	}

	updateStreamPlayer = (streamID, videoPlayer) => {
		console.log("Called", streamID, this.streams[streamID]);
		if(this.streams[streamID]){
			if(videoPlayer){
				console.log("Called 1")
				this.streams[streamID].addPlayer(videoPlayer);
			}else{
				this.streams[streamID].removePlayer();
			}
		}
	}

	updateStreamDetectionCallback = (streamID, callback) => {
		if(this.streams[streamID]){
			if(callback){
				this.streams[streamID].addDetectionCallback(callback);
			}else{
				this.streams[streamID].removeDetectionCallback();
			}
		}
	}

	streamUnmount = (streamID) => {
		if(streams[streamID]){
			streams[streamID].unmount();
		}
	}

	removeStream = (streamID) => {
		if(streams[streamID]){
			streams[streamID].unmount();
			setTimeout(() => {
				streams[streamID] = null;
			}, 200);
		}
	}
}

const streams = new Streams();

export default streams;