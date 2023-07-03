import React, { Component } from "react";
import { View, Text, Modal, Pressable, TextInput } from "react-native";
import validation from "../../utils/validation";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import RB from "../../backend/remote/";
const defaultData = {
	name: "",
	password: "",
	id: null,
	visible: false,
	busy: false
};
export default class HubAdder extends Component {
	constructor(props) {
		super(props);
		this.state = defaultData;
		this.callback = null;
	}

	show = (previousData = defaultData, cb) => {
		this.setState({
			...previousData,
			visible: true
		});
		this.callback = cb;
	};

	close = () => {
		if(this.state.busy)return;
		this.setState({
			visible: false
		}, () => {
			this.callback = null;
		})
	}

	handleSubmit = async () => {
		try {
			this.setState({
				busy: true
			});
			const { id, name, password } = this.state;
			if(!validation.validString(name)){
				helper.showToast(`Please enter valid hub name`, "error");
				return
			}
			if(!validation.validString(password)){
				helper.showToast("Please enter valid password", "error");
				return
			}
			// const response = await RB.Hubs.create({ id, name, password });
			// TODO: Remove Comments
			// if(response.success){1
				this.callback({
					id,
					name,
					password
				});
				setTimeout(() => {
					this.close();
				}, 100);
			// }else{
				// throw new Error(response?.message || helper.errorText);
			// }
		} catch (err) {
			helper.showToast(err.message, 'error');
		} finally {
			this.setState({
				busy: false
			});
		}
	}


	render() {
		const { id, visible, name, password  } = this.state;
		return (
			<Modal
				visible={visible}
				transparent
				onRequestClose={this.handleClose}
				animationType="fade"
			>
				<View style={style.main}>
					<View style={style.content}>
						<Text style={style.title}>{id ? "Edit" :  "Create"} Hub</Text>
						<TextInput
							onChangeText={(name) => this.setState({ name })}
							style={style.input}
							value={name}
							placeholderTextColor={colors.silver}
							placeholder={"Hub Name"}
						/>
						<TextInput
							onChangeText={(password) =>
								this.setState({ password })
							}
							onSubmitEditing={this.handleSubmit}
							value={password}
							style={style.input}
							placeholderTextColor={colors.silver}
							placeholder={"Hub Password"}
						/>
						<Pressable onPres={this.handleSubmit} style={style.button}>
							<Text style={style.buttonTxt}>
								Submit
							</Text>
						</Pressable>
						<Pressable onPress={this.close} style={[style.button, style.cancel]}>
							<Text style={[style.buttonTxt, {
								color: colors.silver
							}]}>
								Cancel
							</Text>
						</Pressable>
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
		backgroundColor: colors.background2
	}
};