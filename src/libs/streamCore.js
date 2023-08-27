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

	reloadStream = (streamID) => {
		this.removeStream(streamID);
		setTimeout(() => {
			this.addStream(streamID);
		}, 500);
	}

	updateStreamPlayer = (streamID, videoPlayer) => {
		if(this.streams[streamID]){
			if(videoPlayer){
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
		if(this.streams[streamID]){
			this.streams[streamID].unmount();
		}
	}

	removeStream = (streamID) => {
		if(this.streams[streamID]){
			this.streams[streamID].unmount();
			this.streams[streamID].clean();
			setTimeout(() => {
				this.streams[streamID] = null;
			}, 200);
		}
	}
}

const streams = new Streams();

export default streams;