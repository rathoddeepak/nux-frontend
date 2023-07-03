import React, { Component } from "react";
import { View, Text, Pressable, TextInput, ImageBackground } from "react-native";
import validation from "../../utils/validation";
import helper from "../../utils/helper";
import colors from "../../themes/colors";
import RB from "../../backend/remote/";
import DB from "../../db/";
const stationTab = {
	input1: "Station ID",
	input2: "Station Password",
};

const hubTab = {
	input1: "Hub ID",
	input2: "Hub Password",
};

const tabs = ["Hub", "Station"];
const HUB = 0;
const STATION = 1;
const contentWidth = 350;
const backgroundImage = "https://images.unsplash.com/photo-1655720406770-12ea329b5b61?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2832&q=80";

export default class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentTab: 0,
			tabData: stationTab,
			input1: "",
			input2: "",
		};
	}

	componentDidMount(){
		// alert(DB.Account.getStationId())
	}

	handleTabChange = (currentTab) => {
		const tabData = currentTab === HUB ? hubTab : stationTab;
		this.setState({
			currentTab,
			tabData,
			input1: "",
			input2: "",
		});
	};

	handleLogin = async () => {
		try {
			this.setState({
				busy: true
			});
			const { input1, currentTab, input2 } = this.state;
			let id = input1;
			let password = input2;
			if(!validation.validString(id)){
				const entity = currentTab ? "station" : "hub";
				helper.showToast(`Please enter valid ${entity} id`, "error");
				return
			}
			if(!validation.validString(password)){
				helper.showToast("Please enter valid password", "error");
				return
			}
			let apiFunction = RB.Account.hubLogin;
			if(currentTab === STATION){
				apiFunction = RB.Account.stationLogin;
			}
			const result = await apiFunction({ id, password });
			if(!result.success){
				if(currentTab === HUB){
					DB.Account.setHubId(result.data.id);
				}else{
					// DB.Account.setStationId(result.data.id);
					// TODO: Remove later
					DB.Account.setStationId(1);
				}
				helper.showToast("Loggedin successfully!");
			}else{
				throw new Error(result?.message || helper.errorText);
			}
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false
			});
		}
	}

	renderTab = (tab, index) => {
		const selected = index === this.state.currentTab;
		const color = selected ? colors.buttonTxt : colors.silver;
		const backgroundColor = selected ? colors.primary : colors.background;
		return (
			<Pressable
				onPress={() => this.handleTabChange(index)}
				style={[style.tabItem, { backgroundColor }]}
				key={tab}
			>
				<Text style={[style.tabText, { color }]}>{tab}</Text>
			</Pressable>
		);
	};

	render() {
		const { tabData } = this.state;
		return (
			<ImageBackground source={{ uri: backgroundImage }} style={style.main}>
				<View style={style.content}>
					<Text style={style.title}>Login</Text>
					<Text style={style.desc}>
						Enter valid ID and password to login
					</Text>
					<View style={style.tabRow}>{tabs.map(this.renderTab)}</View>
					<TextInput
						onChangeText={(input1) => this.setState({ input1 })}
						style={style.input}
						placeholderTextColor={colors.silver}
						placeholder={tabData.input1}
					/>
					<TextInput
						onChangeText={(input2) => this.setState({ input2 })}
						style={style.input}
						placeholderTextColor={colors.silver}
						placeholder={tabData.input2}
					/>
					<Pressable onPress={this.handleLogin} style={style.button}>
						<Text style={style.buttonText}>Login</Text>
					</Pressable>
				</View>
			</ImageBackground>
		);
	}
}

const style = {
	tabRow: {
		width: contentWidth,
		borderRadius: 6,
		overflow: "hidden",
		height: 50,
		flexDirection: "row",
	},
	tabItem: {
		outline: "none",
		width: "50%",
		justifyContent: "center",
		alignItems: "center",
	},
	tabText: {
		fontSize: 15,
		fontWeight: "bold",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		width: contentWidth,
		color: colors.silver,
	},
	desc: {
		fontSize: 14,
		width: contentWidth,
		marginTop: 3,
		marginBottom: 20,
		color: colors.silver,
	},
	main: {
		height: helper.height,
		width: helper.width,
		backgroundColor: colors.background2,
		justifyContent: "center",
		alignItems: "center",
	},
	content: {
		width: "40%",
		height: "100%",
		alignItems: "center",
		justifyContent: "center",
		alignSelf: "flex-end",
		overflow: "hidden",
		backgroundColor: colors.background3,
	},
	input: {
		width: contentWidth,
		height: 50,
		paddingLeft: 10,
		borderRadius: 6,
		marginTop: 15,
		borderWidth: 1,
		borderColor: colors.borderColor,
		color: colors.white,
		backgroundColor: colors.background,
		outline: "none",
	},
	button: {
		width: contentWidth,
		height: 50,
		marginTop: 15,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 6,
	},
	buttonText: {
		color: colors.buttonTxt,
		fontSize: 16,
		fontWeight: "bold",
	},
};