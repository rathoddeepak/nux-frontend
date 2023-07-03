import React, { Component } from "react";
import { View } from "react-native";
import StreamCore from "../../libs/streamCore";

export default class Player extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
		};
		this.drawCtx = null;
		this.isWriterSet = false;
	}
	componentDidMount() {
		const { uuid } = this.props.data;
		this.drawCtx = this.drawCanvas.getContext("2d");
		StreamCore.updateStreamPlayer(uuid, this.currentPlayer);
		StreamCore.updateStreamDetectionCallback(uuid, this.drawBoxes);
	}
	componentWillUnmount() {
		const { uuid } = this.props.data;
		StreamCore.streamUnmount(uuid);
	}
	drawBoxes = (objects) => {
		//clear the previous drawings
		if (this.isWriterSet === false) {
			this.drawCanvas.width = this.currentPlayer.videoWidth;
			this.drawCanvas.height = this.currentPlayer.videoHeight;
			//Some styles for the drawcanvas
			this.drawCtx.lineWidth = 2;
			this.drawCtx.strokeStyle = "cyan";
			this.drawCtx.font = "20px Verdana";
			this.drawCtx.fillStyle = "cyan";
		}
		this.drawCtx.clearRect(
			0,
			0,
			this.drawCanvas.width,
			this.drawCanvas.height
		);
		//filter out objects that contain a class_name and then draw boxes and labels on each
		objects.forEach((object) => {
			let x = object[0] * this.drawCanvas.width;
			let y = object[1] * this.drawCanvas.height;
			let width = object[2] * this.drawCanvas.width - x;
			let height = object[3] * this.drawCanvas.height - y;

			//flip the x axis if local video is mirrored
			// if (mirror) {
			//     x = this.drawCanvas.width - (x + width)
			// }

			this.drawCtx.fillText("Person", x + 5, y + 20);
			this.drawCtx.strokeRect(x, y, width, height);
		});
	};
	render() {
		const { width, height } = this.props;
		return (
			<View style={[style.main, { width, height }]}>
				<video
					ref={(ref) => (this.currentPlayer = ref)}
					autoPlay
					controls={false}
					muted
					playsInline
					style={style.video}
				/>
				<canvas
					style={style.canvas}
					ref={(ref) => (this.drawCanvas = ref)}
				/>
			</View>
		);
	}
}

const style = {
	main: {
		height: "100%",
		width: "100%",
		overflow: "hidden",
		alignItems: "center",
		justifyContent: "center"
	},
	video: {
	},
	canvas: {
		position: "absolute",
		zIndex: 1,
	},
};