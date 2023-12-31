import React, { Component } from "react";
import { View, Text, Pressable } from "react-native";
import StreamCore from "../../libs/streamCore";
import LB from "../../backend/local";
import colors from "../../themes/colors";
import FeatherIcons from "feather-icons-react";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import helper from "../../utils/helper";

export default class StreamPlayer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			width: 0,
			height: 0,
			hasObjects: false,
			objects: [],
		};
		this.drawCtx = null;
		this.isWriterSet = false;
	}
	componentDidMount() {
		const { id } = this.props.data || {};
		if (id) {
			this.drawCtx = this.drawCanvas.getContext("2d");
			this.loadStream(id);
		}
	}

	loadStream = () => {
		const { id } = this.props.data || {};
		const uuid = LB.Stream.uuid(id);
		StreamCore.updateStreamPlayer(uuid, this.currentPlayer);
		StreamCore.updateStreamDetectionCallback(uuid, this.drawBoxes);
	};

	stopStream = () => {
		const { id } = this.props.data || {};
		this.currentPlayer.srcObject = null;
		const uuid = LB.Stream.uuid(id);
		StreamCore.updateStreamPlayer(uuid, null);
		StreamCore.updateStreamDetectionCallback(uuid, null);
	};

	componentWillUnmount() {
		const { id } = this.props.data || {};
		const uuid = LB.Stream.uuid(id);
		this.currentPlayer.srcObject = null;
		StreamCore.updateStreamPlayer(uuid, null);
		StreamCore.updateStreamDetectionCallback(uuid, null);
	}

	drawBoxes = ({ objects, width, height }) => {
		//clear the previous drawings

		const arDim = helper.calculateAspectRatioFit(
			width,
			height,
			this.props.width,
			this.props.height
		);

		this.drawCanvas.width = arDim.width;
		this.drawCanvas.height = arDim.height;
		//Some styles for the drawcanvas
		this.drawCtx.lineWidth = 2;
		this.drawCtx.strokeStyle = "cyan";
		this.drawCtx.font = "20px Verdana";
		this.drawCtx.fillStyle = "cyan";
		this.drawCtx.clearRect(
			0,
			0,
			this.drawCanvas.width,
			this.drawCanvas.height
		);
		//filter out objects that contain a class_name and then draw boxes and labels on each
		const hasObjects = objects?.length > 0;
		const renderableObject = [];

		const aggregateClasses = { person: 0, car: 0, bicycle: 0 };
		const emoji = {
			person: EmojiPeopleIcon,
			car: DirectionsCarIcon,
			bicycle: DirectionsBikeIcon,
		};

		objects.forEach((object) => {
			const coords = object.coord;
			let x = coords[0] * this.drawCanvas.width;
			let y = coords[1] * this.drawCanvas.height;
			let boxWidth = coords[2] * this.drawCanvas.width - x;
			let boxHeight = coords[3] * this.drawCanvas.height - y;
			if (aggregateClasses[object.name] !== undefined) {
				aggregateClasses[object.name] += 1;
			}

			//flip the x axis if local video is mirrored
			// if (mirror) {
			//     x = this.drawCanvas.width - (x + width)
			// }

			this.drawCtx.fillText(object.name, x + 5, y + 20);
			this.drawCtx.strokeRect(x, y, boxWidth, boxHeight);
		});

		for (let objectKey of Object.keys(aggregateClasses)) {
			const count = aggregateClasses[objectKey];
			if (count) {
				renderableObject.push({
					Icon: emoji[objectKey],
					name: objectKey,
					count,
				});
			}
		}

		this.setState({
			objects: renderableObject,
			hasObjects,
		});
	};

	renderDetection = () => {
		const { hasObjects, objects } = this.state;
		return (
			<View style={style.objectDetection}>
				{hasObjects ? (
					objects.map(({ Icon, count, name }, index) => (
						<View key={name} style={style.objectMetaCover}>
							<Icon sx={{ fontSize: 20, color: colors.green }} />
							<View style={style.badge}>
								<Text style={style.objectMetaTxt}>{count}</Text>
							</View>
						</View>
					))
				) : (
					<Text style={[style.objectMetaTxt, { marginTop: 5 }]}>
						Reading Frames
					</Text>
				)}
			</View>
		);
	};
	render() {
		const { width, height, data, onEdit, onPress } = this.props;
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
				<View style={style.controls}>
					<View style={style.camNameCover}>
						<Text style={style.camName}>{data.name}</Text>
					</View>

					<View style={style.camEditCover}>
						<Pressable onPress={onEdit} style={style.camEditButton}>
							<FeatherIcons
								color={colors.white}
								size={18}
								icon="edit-2"
							/>
						</Pressable>
						<Pressable
							onPress={onPress}
							style={style.camEditButton}
						>
							<FeatherIcons
								color={colors.white}
								size={18}
								icon="info"
							/>
						</Pressable>
					</View>

					{this.renderDetection()}
				</View>
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
		justifyContent: "center",
	},
	video: {
		width: "100%",
		height: "100%",
	},
	canvas: {
		position: "absolute",
		zIndex: 1,
	},
	controls: {
		position: "absolute",
		width: "100%",
		height: "100%",
		zIndex: 2,
	},
	camName: {
		color: colors.white,
		fontWeight: "bold",
		fontSize: 15,
	},
	camNameCover: {
		paddingLeft: 10,
		paddingRight: 20,
		height: 30,
		backgroundColor: "#000000b4",
		justifyContent: "center",
		borderColor: colors.borderColor,
		borderRightWidth: 1,
		borderBottomWidth: 1,
		borderBottomRightRadius: 5,
		position: "absolute",
		top: 0,
		left: 0,
	},
	objectDetection: {
		paddingLeft: 10,
		paddingRight: 20,
		flexDirection: "row",
		height: 30,
		backgroundColor: "#000000b4",
		justifyContent: "center",
		borderColor: colors.borderColor,
		borderRightWidth: 1,
		borderTopWidth: 1,
		borderTopRightRadius: 5,
		position: "absolute",
		bottom: 0,
		left: 0,
	},
	camEditCover: {
		height: 30,
		width: 80,
		backgroundColor: "#000000b4",
		justifyContent: "center",
		borderColor: colors.borderColor,
		borderRightWidth: 1,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomLeftRadius: 5,
		position: "absolute",
		top: 0,
		right: 0,
	},
	camEditButton: {
		width: 40,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
	},
	objectMetaCover: {
		width: 35,
		height: 30,
		marginRight: 6,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	objectMetaTxt: {
		fontSize: 14,
		fontWeight: "bold",
		color: colors.white,
	},
	badge: {
		width: 20,
		height: 20,
		top: -5,
		right: 2,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "red",
		position: "absolute",
		fontWeight: "500",
	},
};