import React, { Component } from "react";
import { View, Image, FlatList, Text, Pressable } from "react-native";
import withRouter from "../../components/withRouter";
import ObjectIcons from "../../utils/objectIcons";
import Header from "../../components/header/";
import LoadingModal from "../../components/loadingModal";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import RB from "../../backend/remote/";
import DB from "../../db/";
import moment from "moment";
import { STATIC_URL } from "../../utils/constants";

const getURL = (frameId, streamId) => {
	return `${STATIC_URL}nuxframes/${streamId}/${frameId}frame.jpg`;
};
const contentHeight = helper.height - 50;
const frameHeight = helper.height * 0.7;
const frameWidth = helper.width * 0.7;
const optionWidth = helper.width - frameWidth;
const frameSize = optionWidth / 3.8;
class Framer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stream: {
				name: "",
			},
			busy: false,
			currentDate: moment(),
			fromTime: null,
			toTime: null,

			dateTxt: "",
			fromTimeTxt: "",
			toTimeTxt: "",
			frames: [],

			selectedIndex: -1,
			selected: {},

			visibleObjects: [],
			selectedDrawClass: null,
		};
		this.drawCtx = null;
	}

	componentDidMount() {
		const { stream_id } = this.props.params || {};
		const stationId = DB.Account.getStationId();
		const hubId = DB.Account.getHubId();
		if ((!stationId && !hubId) || !stream_id) {
			this.props.navigate("/login");
		}
		this.setTime();
		this.loadStreamData();
		this.drawCtx = this.drawCanvas.getContext("2d");
	}

	selectCurrent = (item, index) => {
		this.setState(
			{
				selected: item,
				selectedIndex: index,
			},
			this.drawSelected
		);
		this.frameContainer.focus();
	};

	next = () => {
		const { selectedIndex, frames } = this.state;
		const nextIndex = selectedIndex + 1;
		if (nextIndex < frames.length) {
			this.setState(
				{
					selectedIndex: nextIndex,
					selected: frames[nextIndex],
				},
				this.drawSelected
			);
		}
	};

	previous = () => {
		const { selectedIndex, frames } = this.state;
		const nextIndex = selectedIndex - 1;
		if (nextIndex >= 0) {
			this.setState(
				{
					selectedIndex: nextIndex,
					selected: frames[nextIndex],
				},
				this.drawSelected
			);
		}
	};

	handlePressIn = ({ nativeEvent: { keyCode } }) => {
		if (keyCode === 39) {
			this.next();
		} else if (keyCode === 37) {
			this.previous();
		}
	};

	setDate = (e) => {
		const { toTime, fromTime } = this.state;
		const currentDate = moment(e.target.value);
		const mFromTime = moment(
			currentDate.format("MM DD YYYY") + " " + fromTime.format("hh:mm a"),
			"MM DD YYYY hh:mm a"
		);
	   	const mToTime = moment(
			currentDate.format("MM DD YYYY") + " " + toTime.format("hh:mm a"),
			"MM DD YYYY hh:mm a"
		);
		console.log(mFromTime, mToTime)
		this.setState(
			{
				currentDate,
				fromTime: mFromTime,
				toTime: mToTime
			},
			this.formatTime
		);
	};

	setFromTime = (e) => {
		const { currentDate } = this.state;
		const fromTime = moment(
			currentDate.format("MM DD YYYY") + " " + e.target.value,
			"MM DD YYYY hh:mm"
		);
		this.setState(
			{
				fromTime,
			},
			this.formatTime
		);
	};

	setToTime = (e) => {
		const { currentDate } = this.state;
		const toTime = moment(
			currentDate.format("MM DD YYYY") + " " + e.target.value,
			"MM DD YYYY hh:mm"
		);
		this.setState(
			{
				toTime,
			},
			this.formatTime
		);
	};

	setTime = () => {
		const { currentDate } = this.state;
		const fromTime = moment(currentDate).startOf("day");
		const toTime = moment(currentDate).endOf("day");
		this.setState(
			{
				fromTime,
				toTime,
			},
			this.formatTime
		);
	};

	formatTime = () => {
		const { currentDate, fromTime, toTime } = this.state;
		const dateTxt = currentDate.format("DD MMM YYYY");
		const fromTimeTxt = fromTime.format("hh:mm a");
		const toTimeTxt = toTime.format("hh:mm a");
		this.setState({
			dateTxt,
			fromTimeTxt,
			toTimeTxt,
			frames: [],
			selectedIndex: -1,
			selected: {},
		});
	};

	loadStreamData = async () => {
		try {
			const { stream_id } = this.props.params;
			this.setState({ busy: true });
			const response = await RB.Stream.streamData(stream_id);
			if (response.success) {
				this.setState({
					stream: response.data,
				});
			} else {
				throw new Error(response?.message || helper.reload_page);
			}
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false,
			});
		}
	};

	loadFrames = async (showIndicator = false) => {
		try {
			const { stream_id } = this.props.params;
			const { fromTime, toTime, frames } = this.state;
			if (fromTime > toTime) {
				helper.showToast(
					"From time cannot be greater than to time",
					"error"
				);
				return;
			}
			if(showIndicator){
				this.setState({ busy: true });
			}			
			const response = await RB.Analysis.loadFrames({
				streamId: stream_id,
				dateFrom: fromTime.format("MM DD YYYY hh:mm a"),
				dateTo: toTime.format("MM DD YYYY hh:mm a"),
				offset: frames.length,
			});
			if (response.success) {
				this.setState({
					frames: [...frames, ...response.data],
				});
			} else {
				throw new Error(response?.message || helper.reload_page);
			}
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false,
			});
		}
	};

	renderFrame = ({ item, index }) => {
		const { id, streamId } = item;
		const uri = getURL(id, streamId);
		const selected = this.state.selectedIndex === index;
		const borderColor = selected ? colors.red : colors.borderColor;
		const borderWidth = selected ? 3 : 1;
		return (
			<Pressable
				onPress={() => {
					this.selectCurrent(item, index);
				}}
				style={[style.frame, { borderWidth, borderColor }]}
			>
				<Image style={style.image} source={{ uri }} />
			</Pressable>
		);
	};

	drawSelected = () => {
		const { selected, selectedDrawClass } = this.state;
		const objectIndexSet = new Map();
		let visibleObjects = [];
		let currentIndex = 0;
		let i = 0;
		for (let object of selected.objects || []) {
			const { coord, name } = object;
			if (objectIndexSet.has(name)) {
				const objectIndex = objectIndexSet.get(name);
				visibleObjects[objectIndex].count += 1;
			} else {
				objectIndexSet.set(name, currentIndex);
				visibleObjects.push({
					name: name,
					Icon: ObjectIcons[name] || View,
					count: 1,
				});
				currentIndex += 1;
			}

			if (!this.drawCtx) {
				continue;
			}

			const { width, height } = selected;

			const arDim = helper.calculateAspectRatioFit(
				width,
				height,
				frameWidth,
				frameHeight
			);

			if(i === 0){
				this.drawCanvas.width = arDim.width;
				this.drawCanvas.height = arDim.height;
				this.drawCtx.lineWidth = 5;
				this.drawCtx.strokeStyle = colors.red;
				this.drawCtx.font = "20px Verdana";
				this.drawCtx.fillStyle = colors.red;
				this.drawCtx.clearRect(
					0,
					0,
					this.drawCanvas.width,
					this.drawCanvas.height
				);
				i += 1;
			}

			if (selectedDrawClass && selectedDrawClass !== name) {
				continue;
			}

			const x = coord[0] * this.drawCanvas.width;
			const y = coord[1] * this.drawCanvas.height;
			const boxWidth = coord[2] * this.drawCanvas.width - x;
			const boxHeight = coord[3] * this.drawCanvas.height - y;

			this.drawCtx.fillText(name, x + 5, y + 20);
			this.drawCtx.strokeRect(x, y, boxWidth, boxHeight);
		}
		this.setState({
			visibleObjects,
		});
	};

	onEndReached = ({ distanceFromEnd }) => {
	    this.loadFrames(false);
	}

	renderSelectedInfo = (
		selected,
		objects,
		selectedDrawClass,
		totalObjectCount
	) => {
		const time = moment(selected.createdAt);
		const dateTxt = time.format("DD MMM YYYY");
		const timeTxt = time.format("hh:mm:ss a");
		return (
			<>
				<View style={style.photoInfoCover}>
					<Text style={style.photoInfoText}>
						Captured on{" "}
						<Text style={{ color: colors.ylw }}>{dateTxt}</Text> at{" "}
						<Text style={{ color: colors.ylw }}>{timeTxt}</Text>
					</Text>
				</View>

				<View style={style.objectRow}>
					<Pressable
						onPress={() => {
							this.setState(
								{
									selectedDrawClass: null,
								},
								this.drawSelected
							);
						}}
						style={[
							style.objectCard,
							{
								borderColor: selectedDrawClass
									? colors.background2
									: colors.primary,
							},
						]}
					>
						<Text
							style={[
								style.objectText,
								{
									paddingLeft: 10,
								},
							]}
						>
							{selected?.objects?.length || 0} Objects
						</Text>
					</Pressable>
					{objects.map(({ Icon, name, count }) => {
						const selected = name === selectedDrawClass;
						return (
							<Pressable
								onPress={() => {
									this.setState(
										{
											selectedDrawClass: name,
										},
										this.drawSelected
									);
								}}
								style={[
									style.objectCard,
									{
										borderColor: selected
											? colors.primary
											: colors.background2,
									},
								]}
							>
								<View style={style.objectIcon}>
									<Icon sx={{ color: colors.primary }} />
								</View>
								<Text style={style.objectText}>
									{count} {name}
								</Text>
							</Pressable>
						);
					})}
					<Pressable
						onPress={() => {
							this.setState(
								{
									selectedDrawClass: "none",
								},
								this.drawSelected
							);
						}}
						style={[
							style.objectCard,
							{
								borderColor:
									selectedDrawClass === "none"
										? colors.primary
										: colors.background2,
							},
						]}
					>
						<Text
							style={[
								style.objectText,
								{
									paddingLeft: 10,
								},
							]}
						>
							Hide Objects
						</Text>
					</Pressable>
				</View>
			</>
		);
	};

	render() {
		const {
			stream,
			selected,
			frames,
			busy,
			dateTxt,
			fromTimeTxt,
			toTimeTxt,
			visibleObjects,
			selectedDrawClass,
		} = this.state;
		const uri = getURL(selected?.id, selected?.streamId);
		const isSelected = selected?.id;
		return (
			<>
				<View style={style.main}>
					<Header title={stream.name} />
					<View style={style.content}>
						<View>
							<Pressable
								onKeyDown={this.handlePressIn}
								ref={(ref) => (this.frameContainer = ref)}
								style={style.frameContainer}
							>
								<Image
									resizeMode="contain"
									style={style.image}
									source={{ uri }}
								/>
								<canvas
									ref={(ref) => (this.drawCanvas = ref)}
									style={style.canvas}
								/>
							</Pressable>
							<View style={style.infoContent}>
								{isSelected
									? this.renderSelectedInfo(
											selected,
											visibleObjects,
											selectedDrawClass
									  )
									: null}
							</View>
						</View>
						<View style={style.optionContainer}>
							<Text style={style.optionTxt}>Date</Text>
							<Pressable
								onPress={() => {
									this.currentDatePicker.showPicker();
								}}
								style={style.inputCover}
							>
								<Text style={style.inputTxt}>{dateTxt}</Text>
								<input
									id="datePicker"
									type="date"
									style={{
										opacity: 0,
									}}
									onChange={this.setDate}
									ref={(ref) =>
										(this.currentDatePicker = ref)
									}
								/>
							</Pressable>
							<Text style={style.optionTxt}>From Time</Text>
							<Pressable
								onPress={() => {
									this.fromTimePicker.showPicker();
								}}
								style={style.inputCover}
							>
								<Text style={style.inputTxt}>
									{fromTimeTxt}
								</Text>
								<input
									type="time"
									style={{
										opacity: 0,
									}}
									onChange={this.setFromTime}
									ref={(ref) => (this.fromTimePicker = ref)}
								/>
							</Pressable>
							<Text style={style.optionTxt}>To Time</Text>
							<Pressable
								onPress={() => {
									this.toTimePicker.showPicker();
								}}
								style={style.inputCover}
							>
								<Text style={style.inputTxt}>{toTimeTxt}</Text>
								<input
									type="time"
									style={{
										opacity: 0,
									}}
									onChange={this.setToTime}
									ref={(ref) => (this.toTimePicker = ref)}
								/>
							</Pressable>

							<Pressable
								style={style.button}
								onPress={this.loadFrames}
							>
								<Text style={style.buttonTxt}>Load Frames</Text>
							</Pressable>

							<FlatList
								data={frames}
								contentContainerStyle={{
									paddingVertical: 10,
								}}
								ref={(ref) => (this.flatList = ref)}
								showsVerticalScrollIndicator={false}
								renderItem={this.renderFrame}
								numColumns={3}
								onEndReached={this.onEndReached}
								onEndReachedThreshold={0.5}
							/>
						</View>
					</View>
				</View>
				<LoadingModal busy={busy} />
			</>
		);
	}
}

const style = {
	main: {
		backgroundColor: colors.background3,
		height: helper.height,
		width: helper.width,
	},
	content: {
		width: helper.width,
		height: contentHeight,
		flexDirection: "row",
	},
	frameContainer: {
		height: frameHeight,
		width: frameWidth,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		backgroundColor: colors.background2,
	},
	optionContainer: {
		borderLeftWidth: 1,
		borderColor: colors.borderColor,
		width: optionWidth,
		height: contentHeight,
		paddingHorizontal: 20,
		backgroundColor: colors.background2,
	},
	optionTxt: {
		fontSize: 18,
		marginTop: 20,
		color: colors.silver,
		fontWeight: "bold",
	},
	inputCover: {
		width: "100%",
		height: 50,
		paddingLeft: 15,
		borderRadius: 6,
		marginTop: 15,
		borderWidth: 1,
		borderColor: colors.borderColor,
		color: colors.white,
		backgroundColor: colors.background3,
		outline: "none",
	},
	button: {
		width: "100%",
		height: 50,
		borderRadius: 6,
		marginTop: 20,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.primary,
		outline: "none",
	},
	inputTxt: {
		fontSize: 16,
		marginTop: 15,
		color: colors.silver,
		fontWeight: "500",
	},
	buttonTxt: {
		color: colors.buttonTxt,
		fontSize: 16,
		fontWeight: "bold",
	},
	frame: {
		width: frameSize,
		height: frameSize,
		marginTop: 20,
		marginRight: 20,
		borderWidth: 1,
		overflow: "hidden",
		borderColor: colors.borderColor,
		backgroundColor: colors.background2,
	},
	image: {
		width: "100%",
		height: "100%",
	},
	canvas: {
		alignSelf: "center",
		position: "absolute",
		zIndex: 1,
	},
	infoContent: {
		width: frameWidth,
	},
	photoInfoCover: {
		height: 40,
		width: frameWidth,
		backgroundColor: colors.background2,
		borderBottomWidth: 1,
		borderColor: colors.borderColor,
		justifyContent: "center",
		paddingLeft: 10,
	},
	photoInfoText: {
		fontSize: 15,
		color: colors.silver,
		fontWeight: "bold",
	},
	objectRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		width: frameWidth,
	},
	objectCard: {
		height: 50,
		width: 200,
		alignItems: "center",
		flexDirection: "row",
		marginTop: 10,
		marginLeft: 10,
		borderWidth: 1,
		backgroundColor: colors.background2,
		borderRadius: 5,
	},
	objectIcon: {
		height: 40,
		width: 40,
		justifyContent: "center",
		alignItems: "center",
	},
	objectText: {
		fontSize: 15,
		fontWeight: "bold",
		color: colors.primary,
	},
};

export default withRouter(Framer);