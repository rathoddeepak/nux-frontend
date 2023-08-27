import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import withRouter from "../../components/withRouter";
import FeatherIcons from "feather-icons-react";
import Header from "../../components/header/";
import HubAdder from "../../components/adder/hubAdder";
import LoadingModal from "../../components/loadingModal";

import Footer from "./footer";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import RB from "../../backend/remote/";
import DB from "../../db/";


const contentHeight = helper.height - 100;
const hubWidth = helper.width / 5.5;

class StationHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			station: {
				name: "",
			},
			hubs: [],
		};
	}

	componentDidMount() {
		const stationId = DB.Account.getStationId();
		if (!stationId){
			this.props.navigate("/login");
			return
		}
		const { station_id } = this.props.params || {};
		if (station_id) {
			this.loadStationData();
		} else {
			this.props.navigate("/login");
		}
	}

	loadStationData = async () => {
		try {
			const { station_id } = this.props.params;
			this.setState({ busy: true });
			const response = await RB.Station.stationHubs(station_id);
			if (response.success) {
				const data = response.data;
				const station = {
					id: data.id,
					name: data.name,
				};
				const hubs = data.hubs || [];
				this.setState({
					station,
					hubs,
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
		const stationId = this.props.params.station_id;
		this.hubAdder.show(undefined, stationId, (hubData) => {
			hubs.push(hubData);
			this.setState({ hubs });
		});
	};

	editHub = () => {
		const { currentHub, hubs } = this.state;
		this.clearMenu();
		const stationId = this.props.params.station_id;
		this.hubAdder.show(currentHub, stationId, (updatedHub) => {
			const hubIdx = hubs.findIndex((h) => h.id === currentHub.id);
			hubs[hubIdx] = updatedHub;
			this.setState({ hubs });
		});
	};

	disableHub = async () => {
		const { currentHub, hubs } = this.state;
		this.clearMenu();
		const confirmed = window.confirm(
			"Are you sure you want to disable hub"
		);
		if (!confirmed) {
			return;
		}

		try {
			this.setState({
				busy: true,
			});
			const response = await RB.Hub.disableHub(currentHub.id);
			if (response.success) {
				const hubIdx = hubs.findIndex((h) => h.id === currentHub.id);
				hubs.splice(hubIdx, 1);
				this.setState({ hubs });
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

	navHub = (hubId) => {
		this.props.navigate("/hub/station/" + hubId);
	};

	logout = () => {
		const confirmed = window.confirm(
			"Are you sure you want to logout"
		);
		if(confirmed){
			DB.Account.setStationId(0);
			DB.Account.setHubId(0);
			this.props.navigate("/login");
		}		
	}

	renderHub = (hub) => {
		const streamCount = (hub.streams || []).length;
		return (
			<Pressable
				onPress={() => this.handleHubPress(hub.id)}
				style={style.hub}
				key={hub.id}
			>
				<Text style={style.hubTitle}>{hub.name}</Text>
				<Text style={style.hubDesc}>{streamCount} Cameras</Text>
				<Pressable
					onPress={() => {
						this.navHub(hub.id);
					}}
					style={style.hubButton}
				>
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
		const { station, hubs, menuElement, menuOpen, busy } = this.state;
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
					<Footer
						onHomePress={this.loadStationData}
						onSettingPress={() => {}}
						onLogoutPress={this.logout}
						onHubPress={this.addNewHub}
					/>
				</View>
				<HubAdder ref={(ref) => (this.hubAdder = ref)} />
				<Menu
					id="menu"
					anchorEl={menuElement}
					onClose={this.clearMenu}
					open={menuOpen}
				>
					<MenuItem onClick={this.editHub}>Edit Hub</MenuItem>
					<MenuItem onClick={this.disableHub}>Disable Hub</MenuItem>
				</Menu>
				<LoadingModal busy={busy} />
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

export default withRouter(StationHome);