class Stream {
	constructor(streamId) {
		this.uuid = streamId;
		this.webrtc = null;
		this.webrtcSendChannel = null;
		this.mediaStream = null;

		this.apiServer = "http://localhost:3301/detect";

		this.currentPlayer = null;
		this.detectionCallback = null;

		this.mounted = true;
		this.uploadWidth = 240;
	}

	unmount = () => {
		this.mounted = false;
		this.removePlayer();
		this.removeDetectionCallback();
	}

	addPlayer = (playerRef) => {
		this.removePlayer(); // Remove Current Player
		if(playerRef){
			this.currentPlayer = playerRef;
			this.currentPlayer.srcObject = this.mediaStream;
			console.log(this.playerRef, this.mediaStream);
		}
	}

	removePlayer = () => {
		if(this.currentPlayer){
			this.currentPlayer.srcObject = null;
		}
		this.currentPlayer = null;
	}

	addDetectionCallback = (callback) => {
		if(this.detectionCallback){
			this.detectionCallback = null;
		}
		this.detectionCallback = callback;
	}

	removeDetectionCallback = () => {
		this.detectionCallback = null;
	}

	init = async () => {
		this.mediaStream = new MediaStream();		
		this.webrtc = new RTCPeerConnection({
			iceServers: [
				{
					urls: ["stun:stun.l.google.com:19302"],
				},
			],
			sdpSemantics: "unified-plan",
		});
		this.webrtc.onnegotiationneeded = this.handleNegotiationNeeded;
		this.webrtc.onsignalingstatechange = this.signalingstatechange;

		this.webrtc.ontrack = this.ontrack;
		let offer = await this.webrtc.createOffer({
			//iceRestart:true,
			offerToReceiveAudio: true,
			offerToReceiveVideo: true,
		});
		await this.webrtc.setLocalDescription(offer);
	};

	ontrack = (event) => {
		this.mediaStream.addTrack(event.track);
		this.startObjectDetection();
	};

	signalingstatechange = async () => {
		switch (this.webrtc.signalingState) {
			case "have-local-offer":
				const uuid = this.uuid;
				const channel = "0";
				const base_url = "http://localhost:8083";
				const url = `${base_url}/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;
				const formData = new FormData();
				formData.append("data", btoa(this.webrtc.localDescription.sdp));
				fetch(url, {
					method: "POST",
					body: formData,
				})
					.then((response) => response.text())
					.then((data) => {
						this.webrtc.setRemoteDescription(
							new RTCSessionDescription({
								type: "answer",
								sdp: atob(data),
							})
						);
					})
					.catch((err) => {
						console.warn(err);
					});
				break;
			case "stable":
				/*
				 * There is no ongoing exchange of offer and answer underway.
				 * This may mean that the RTCPeerConnection object is new, in which case both the localDescription and remoteDescription are null;
				 * it may also mean that negotiation is complete and a connection has been established.
				 */
				break;

			case "closed":
				/*
				 * The RTCPeerConnection has been closed.
				 */
				break;

			default:
				console.log(
					`unhandled signalingState is ${this.webrtc.signalingState}`
				);
				break;
		}
	};

	handleNegotiationNeeded = async () => {
		const uuid = this.uuid;
		const channel = "0";
		const base_url = "http://localhost:8083";
		const url = `${base_url}/stream/${uuid}/channel/${channel}/webrtc?uuid=${uuid}&channel=${channel}`;
		const offer = await this.webrtc.createOffer();
		const formData = new FormData();
		formData.append("data", btoa(this.webrtc.localDescription.sdp));
		await this.webrtc.setLocalDescription(offer);
		fetch(url, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.text())
			.then((data) => {
				this.webrtc.setRemoteDescription(
					new RTCSessionDescription({
						type: "answer",
						sdp: atob(data),
					})
				);
			})
			.catch((err) => {
				console.warn(err);
			});
	};

	getFile = () => {
		return new Promise(async (resolve) => {
			try {
				const track = this.mediaStream?.getVideoTracks()?.[0] || null;
				if(track){
					const imageCapture = new ImageCapture(track);
					const imageBitmap = await imageCapture.grabFrame();

					const ratio = imageBitmap.height / imageBitmap.width;
					const uploadHeight = this.uploadWidth * ratio;

					const canvas = document.createElement('canvas');
					canvas.width = this.uploadWidth;
					canvas.height = uploadHeight;
					const context = canvas.getContext('2d');				

					context.drawImage(
						imageBitmap,
						0,
						0,
						imageBitmap.width,
						imageBitmap.height,
						0,
						0,
						this.uploadWidth,
						uploadHeight
					)
					canvas.toBlob((imageBlob) => {
						resolve(imageBlob);
					}, "image/jpeg");
				}else{
					resolve(null);
				}				
			} catch (err) {
				console.log(err);
				resolve(null);
			}
		});		
	}

	//Add file blob to a form and post
	postFile = (file) => {
		if(!file){
			this.retry();
			return;
		}
		if(!this.mounted){
			return;
		}
		//Set options as form data
		let formData = new FormData();
		formData.append("image", file);
		fetch(this.apiServer, {
			method: "POST",
			body: formData,
		})
		.then((response) => response.json())
		.then(async (objects) => {
			//draw the boxes
			// TODO: callback
			if(this.detectionCallback){
				this.detectionCallback(objects);
			}
			setTimeout(async () => {
				const newFile = await this.getFile();
				this.postFile(newFile);
			}, 500);

		})
		.catch((err) => {
			console.warn(err);
			this.retry();
		});
	};

	startObjectDetection = async () => {
	    const newFile = await this.getFile();
	    console.log(newFile);
	    this.postFile(newFile);
	}

	retry = () => {
		if(this.mounted){
			setTimeout(() => {
				this.startObjectDetection();
			}, 600);
		}		
	}
}

export default Stream;