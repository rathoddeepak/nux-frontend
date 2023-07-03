import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import RB from "../../backend/remote/";
import FeatherIcons from "feather-icons-react";
import Header from "../../components/header/";
import HubAdder from "../../components/adder/hubAdder";
import Footer from "./footer";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

const contentHeight = helper.height - 100;
const hubWidth = helper.width / 5.5;
export default class StationHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			station: {
				name: "Mahu Cantonment",
			},
			hubs: [
				{
					id: 1,
					name: "Mandir Gate",
					password: "123456",
					streamCount: 0,
				},
			],
		};
	}

	onHubOptions = (e, hub) => {
		this.setState({
			currentHub: hub,
			menuOpen: true,
			menuElement: e.currentTarget,
		});
	};

	clearMenu = () => {
		this.setState({
			menuOpen: false,
			menuElement: null,
			currentHub: null,
		});
	};

	handleHubPress = (hubId) => {};

	addNewHub = () => {
		const hubs = this.state.hubs || [];
		this.hubAdder.show(undefined, (hubData) => {
			hubs.push(hubData);
			this.setState({ hubs });
		});
	};

	editHub = () => {
		const { currentHub, hubs } = this.state;
		this.clearMenu();
		this.hubAdder.show(currentHub, (updatedHub) => {
			const hubIdx = hubs.findIndex((h) => h.id === currentHub.id);
			hubs[hubIdx] = updatedHub;
			this.setState({ hubs });
		});
	};

	deleteHub = async () => {
		const { currentHub, hubs } = this.state;
		this.clearMenu();
		const confirmed = window.confirm("Are you sure you want to delete hub");
		if (!confirmed) {
			return;
		}

		try {
			this.setState({
				busy: true,
			});
			// const response = await RB.Hubs.delete(currentHub.id);
			// TODO: Remove Comments
			// if(response.success){1
			const hubIdx = hubs.findIndex((h) => h.id === currentHub.id);
			hubs.splice(hubIdx, 1);
			this.setState({ hubs });
			// }else{
			// throw new Error(response?.message || helper.errorText);
			// }
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false,
			});
		}
	};

	renderHub = (hub) => {
		return (
			<Pressable
				onPress={() => this.handleHubPress(hub.id)}
				style={style.hub}
				key={hub.id}
			>
				<Text style={style.hubTitle}>{hub.name}</Text>
				<Text style={style.hubDesc}>{hub.streamCount} Cameras</Text>
				<Pressable style={style.hubButton}>
					<Text style={style.hubButtonTxt}>View Hub</Text>
				</Pressable>

				<Pressable
					style={style.hubIcon}
					onPress={(e) => this.onHubOptions(e, hub)}
				>
					<FeatherIcons
						color={colors.white}
						size={30}
						icon="more-horizontal"
					/>
				</Pressable>
			</Pressable>
		);
	};

	render() {
		const { station, hubs, menuElement, menuOpen } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header title={station.name} />
					<View style={style.content}>
						<View style={style.hubRow}>
							{hubs.map(this.renderHub)}
							<Pressable
								onPress={this.addNewHub}
								style={[style.hub, style.center]}
							>
								<FeatherIcons
									icon="plus"
									color={colors.borderColor}
									size={30}
								/>
								<Text style={style.addDesc}>
									Click here to add new hub
								</Text>
							</Pressable>
						</View>
					</View>
					<Footer onHubPress={this.addNewHub} />
				</View>
				<HubAdder ref={(ref) => (this.hubAdder = ref)} />
				<Menu
					id="menu"
					anchorEl={menuElement}
					onClose={this.clearMenu}
					open={menuOpen}
					// PaperProps={{
					//   style: {
					//     maxHeight: ITEM_HEIGHT * 4.5,
					//     width: '20ch',
					//   },
					// }}
				>
					<MenuItem onClick={this.editHub}>Edit Hub</MenuItem>
					<MenuItem onClick={this.deleteHub}>Delete Hub</MenuItem>
				</Menu>
			</>
		);
	}
}

const style = StyleSheet.create({
	main: {
		backgroundColor: colors.background3,
		height: helper.height,
		width: helper.width,
	},
	content: {
		width: helper.width,
		height: contentHeight,
	},
	hubRow: {
		width: helper.width,
		flexDirection: "row",
		flexWrap: "wrap",
		padding: 20,
	},
	hub: {
		width: hubWidth,
		height: 110,
		borderRadius: 10,
		padding: 10,
		marginRight: 20,
		backgroundColor: colors.background,
		borderWidth: 1,
		borderColor: colors.borderColor,
	},
	center: {
		justifyContent: "center",
		alignItems: "center",
	},
	hubTitle: {
		fontSize: 18,
		fontWeight: "bold",
		color: colors.white,
		paddingLeft: 5,
	},
	hubDesc: {
		fontSize: 15,
		fontWeight: "500",
		color: colors.white,
		paddingLeft: 5,
		marginTop: 5,
	},
	addDesc: {
		fontSize: 16,
		color: colors.borderColor,
		marginTop: 8,
	},
	hubButton: {
		width: "100%",
		height: 35,
		backgroundColor: colors.primary,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10,
		borderRadius: 5,
	},
	hubButtonTxt: {
		color: colors.black,
		fontWeight: "bold",
		fontSize: 15,
	},
	hubIcon: {
		position: "absolute",
		top: 5,
		right: 10,
	},
});