import React, { Component } from "react";

export default class Home extends Component {
	constructor(props) {
		super(props);
		this.state = {};

		this.webrtc = null;
		this.webrtcSendChannel = null;
		this.mediaStream = null;

		this.isPlaying = false;
		this.gotMetadata = false;

		this.imageCanvas = document.createElement("canvas");
		this.imageCtx = this.imageCanvas.getContext("2d");
		this.drawCtx = null;

		this.uploadWidth = 240;

		this.apiServer = "http://localhost:3301/detect";
	}

	componentDidMount() {
		this.startPlay();
		this.currentPlayer.addEventListener("loadeddata", () => {
			this.currentPlayer.play();
			// makePic();
		});
		//check if metadata is ready - we need the video size
		this.currentPlayer.onloadedmetadata = () => {
			console.log("video metadata ready");
			this.gotMetadata = true;
			if (this.isPlaying) this.startObjectDetection();
		};

		//see if the video has started playing
		this.currentPlayer.onplaying = () => {
			console.log("video playing");
			this.isPlaying = true;
			if (this.gotMetadata) {
				this.startObjectDetection();
			}
		};

		this.drawCtx = this.drawCanvas.getContext("2d");
	}

	startPlay = async () => {
		this.mediaStream = new MediaStream();
		this.currentPlayer.srcObject = this.mediaStream;
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
			offerToReceiveAudio: false,
			offerToReceiveVideo: true,
		});
		await this.webrtc.setLocalDescription(offer);
	};

	ontrack = (event) => {
		console.log(event.streams.length + " track is delivered");
		this.mediaStream.addTrack(event.track);
	};

	signalingstatechange = async () => {
		switch (this.webrtc.signalingState) {
			case "have-local-offer":
				const uuid = "54562a6c-5a0e-4eb2-a73b-e0f1a6be8825";
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
		const uuid = "54562a6c-5a0e-4eb2-a73b-e0f1a6be8825";
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

	//Add file blob to a form and post
	postFile = (file) => {
		//Set options as form data
		const ratio = this.currentPlayer.videoHeight / this.currentPlayer.videoWidth;
		const uploadHeight = this.uploadWidth * ratio;
		let formData = new FormData();
		formData.append("image", file);
		fetch(this.apiServer, {
			method: "POST",
			body: formData,
		})
		.then((response) => response.json())
		.then((objects) => {
			//draw the boxes
			this.drawBoxes(objects);

			//Save and send the next image
			this.imageCtx.drawImage(
				this.currentPlayer,
				0,
				0,
				this.currentPlayer.videoWidth,
				this.currentPlayer.videoHeight,
				0,
				0,
				this.uploadWidth,
				uploadHeight
			);
			this.imageCanvas.toBlob(this.postFile, "image/jpeg");
		})
		.catch((err) => {
			console.warn(err);
		});
	};

	//draw boxes and labels on each detected object
	drawBoxes = (objects) => {
		//clear the previous drawings
		this.drawCtx.clearRect(
			0,
			0,
			this.drawCanvas.width,
			this.drawCanvas.height
		);
		//filter out objects that contain a class_name and then draw boxes and labels on each
		objects
			.forEach((object) => {
				console.log(this.drawCanvas.width, this.drawCanvas.height);
				let x = object[0] * this.drawCanvas.width;
				let y = object[1] * this.drawCanvas.height;
				let width = (object[2] * this.drawCanvas.width) - x;
				let height = (object[3] * this.drawCanvas.height) - y;

				//flip the x axis if local video is mirrored
				// if (mirror) {
				//     x = this.drawCanvas.width - (x + width)
				// }

				this.drawCtx.fillText(
					"Person",
					x + 5,
					y + 20
				);
				this.drawCtx.strokeRect(x, y, width, height);
			});
	};

	startObjectDetection = () => {
	    const ratio = this.currentPlayer.videoHeight / this.currentPlayer.videoWidth;
		const uploadHeight = this.uploadWidth * ratio;

	    //Set canvas sizes base don input video
	    this.drawCanvas.width = this.currentPlayer.videoWidth;
	    this.drawCanvas.height = this.currentPlayer.videoHeight;

	    this.imageCanvas.width = this.uploadWidth;
	    this.imageCanvas.height = this.uploadWidth * (this.currentPlayer.videoHeight / this.currentPlayer.videoWidth);

	    //Some styles for the drawcanvas
	    this.drawCtx.lineWidth = 4;
	    this.drawCtx.strokeStyle = "cyan";
	    this.drawCtx.font = "20px Verdana";
	    this.drawCtx.fillStyle = "cyan";

	    //Save and send the first image
	    this.imageCtx.drawImage(
			this.currentPlayer,
			0,
			0,
			this.currentPlayer.videoWidth,
			this.currentPlayer.videoHeight,
			0,
			0,
			this.uploadWidth,
			uploadHeight
		);
	    this.imageCanvas.toBlob(this.postFile, 'image/jpeg');
	}

	render() {
		return (
			<>
				<video
					ref={(ref) => (this.currentPlayer = ref)}
					autoPlay
					controls
					muted
					playsInline
					style={style.video}
				/>
				<canvas
					style={style.canvas}
					ref={(ref) => (this.drawCanvas = ref)}
				/>
			</>
		);
	}
}

const style = {
	video: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: -1,
	},
	canvas: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		zIndex: 1,
	},
};