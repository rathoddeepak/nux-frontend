import React, { Component } from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";
import Loading from "../loading";
import validation from "../../utils/validation";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import RB from "../../backend/remote/";
import LB from "../../backend/local/";
const defaultData = {
	name: "",
	rtspUrl: "rtsp://192.168.41.171:1945",
	id: undefined,
	visible: false,
	busy: false,
};
export default class StreamAdder extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (previousData, hubId, cb) => {
		this.setState({
			...(previousData || defaultData),
			hubId,
			visible: true,
		});
		this.callback = cb;
	};

	close = () => {
		if (this.state.busy) return;
		this.setState(
			{
				visible: false,
			},
			() => {
				this.callback = null;
			}
		);
	};

	handleSubmit = async () => {
		try {
			this.setState({
				busy: true,
			});
			const { id, name, rtspUrl, hubId } = this.state;
			if (!validation.validString(name)) {
				helper.showToast(`Please enter valid camera name`, "error");
				return;
			}
			if (!validation.validString(rtspUrl)) {
				helper.showToast("Please enter valid url", "error");
				return;
			}
			const response = await RB.Stream.createStream({
				id,
				name,
				hubId,
				rtspUrl,
			});
			if (response.success) {
				this.callback({
					id: response.data.id,
					name,
					rtspUrl,
				});
				if (id) {
					const uuid = LB.Stream.uuid(id);
					LB.Stream.editStream({
						uuid,
						name,
						rtspUrl,
					});
				} else {
					const uuid = LB.Stream.uuid(response.data.id);
					LB.Stream.addStream({
						uuid,
						name,
						rtspUrl,
					});
				}
				setTimeout(() => {
					this.close();
				}, 100);
			} else {
				throw new Error(response?.message || helper.errorText);
			}
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false,
			});
		}
	};

	render() {
		const { id, visible, name, rtspUrl, busy } = this.state;
		return (
			<Modal
				visible={visible}
				transparent
				onRequestClose={this.handleClose}
				animationType="fade"
			>
				<View style={style.main}>
					<View style={style.content}>
						<Text style={style.title}>
							{id ? "Edit" : "Create"} Camera
						</Text>
						<TextInput
							onChangeText={(name) => this.setState({ name })}
							style={style.input}
							value={name}
							onSubmitEditing={() => {
								this.passInput.focus();
							}}
							placeholderTextColor={colors.silver}
							placeholder={"Camera Name"}
						/>
						<TextInput
							onChangeText={(rtspUrl) =>
								this.setState({ rtspUrl })
							}
							ref={(ref) => (this.passInput = ref)}
							onSubmitEditing={this.handleSubmit}
							value={rtspUrl}
							style={style.input}
							placeholderTextColor={colors.silver}
							placeholder={"RTSP URL"}
						/>
						<Pressable
							onPress={this.handleSubmit}
							style={style.button}
						>
							<Text style={style.buttonTxt}>Submit</Text>
						</Pressable>
						{id ? (
							<Pressable
								onPress={() => {
									this.close();
									this.props.onDisablePress(id)
								}}
								style={[
									style.button,
									{
										backgroundColor: colors.red,
									},
								]}
							>
								<Text
									style={[
										style.buttonTxt,
										{
											color: colors.white,
										},
									]}
								>
									Disable Stream
								</Text>
							</Pressable>
						) : null}
						<Pressable
							onPress={this.close}
							style={[style.button, style.cancel]}
						>
							<Text
								style={[
									style.buttonTxt,
									{
										color: colors.silver,
									},
								]}
							>
								Cancel
							</Text>
						</Pressable>

						<Loading busy={busy} />
					</View>
				</View>
			</Modal>
		);
	}
}

const style = {
	main: {
		height: helper.height,
		width: helper.width,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000000b4",
	},
	content: {
		padding: 10,
		borderRadius: 10,
		backgroundColor: colors.background3,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		width: 290,
		color: colors.silver,
	},
	desc: {
		fontSize: 14,
		width: 290,
		marginTop: 3,
		color: colors.silver,
	},
	input: {
		width: 290,
		height: 40,
		paddingLeft: 5,
		borderRadius: 6,
		marginTop: 15,
		fontSize: 15,
		borderWidth: 1,
		borderColor: colors.borderColor,
		color: colors.white,
		backgroundColor: colors.background,
		outline: "none",
	},
	button: {
		width: 290,
		height: 40,
		marginTop: 15,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		backgroundColor: colors.primary,
	},
	buttonTxt: {
		fontSize: 16,
		fontWeight: "bold",
	},
	cancel: {
		backgroundColor: colors.background2,
	},
};