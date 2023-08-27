import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import LoadingModal from "../../components/loadingModal";
import Header from "../../components/header/";
import StreamPlayer from "../../components/player/";
import StreamAdder from "../../components/adder/streamAdder";
import withRouter from "../../components/withRouter";
import Two from "./layout/two";
import Three from "./layout/three";
import Threex1 from "./layout/threex1";
import Four from "./layout/four";
import Fourx1 from "./layout/fourx1";
import Fourx2 from "./layout/fourx2";
import Five from "./layout/five";
import Six from "./layout/six";
import Sixx1 from "./layout/sixx1";
import Sixx2 from "./layout/sixx2";
import Editor from "./editor/";

import RB from "../../backend/remote/";
import LB from "../../backend/local/";
import DB from "../../db/";

import Footer from "./footer";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import { MAX_ALLOWED_STREAM } from "../../utils/constants";

import StreamCore from "../../libs/streamCore";
import StreamSync from "../../libs/streamSync";

const layouts = {
	1: "one",
	2: "two",
	3: "three",
	4: "four",
	5: "five",
	6: "six",
};

const contentHeight = helper.height - 100;

class HubHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hub: {},
			busy: false,
			layoutConfig: layouts,
			streams: [],
			streamWidth: 0,
			streamHeight: 0,
		};
		this.streamPlayer = [];
	}

	showSettings = () => {
		const { hub } = this.state;
		const { layout, classes, id } = hub;
		this.hubEditor.show({
			layout,
			classes,
			hubId: id
		}, ({ isLayout, isClass, layout, classes }) => {
			if(isClass){
				hub.classes = classes;
				this.setState({ hub });
			}else if(isLayout){
				hub.layout = layout;
				this.setState({ layoutConfig: layout, hub });
			}
		})
	}

	componentDidMount() {
		const stationId = DB.Account.getStationId();
		if(stationId){
			this.props.navigate('../');
			return
		}
		const hubId = DB.Account.getHubId();
		if(!hubId){
			this.props.navigate('/login');
		}
		
		const { hub_id } = this.props.params || {};
		if (hub_id) {
			this.loadHubData();
		} else {
			this.props.navigate("/login");
		}
	}

	loadHubData = async () => {
		try {
			const { hub_id } = this.props.params;
			this.setState({ busy: true });
			const response = await RB.Hub.hubStreams(hub_id);
			if (response.success) {
				const data = response.data;
				const hub = {
					id: data.id,
					name: data.name,
					classes: data.classes,
					layout: data.layout
				};
				const remoteStreams = data.streams || [];
				const localStreams = await LB.Stream.allStreams();
				StreamSync(localStreams, remoteStreams);
				this.setState({ hub, layoutConfig: data.layout });
				setTimeout(() => {
					this.startStream(remoteStreams);
				}, 300);
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

	addNewStream = () => {
		if (this.state.streams >= MAX_ALLOWED_STREAM) {
			helper.showToast(
				`You can add upto ${MAX_ALLOWED_STREAM} streams only`
			);
			return;
		}
		const streams = this.state.streams || [];
		const { hub_id } = this.props.params;
		this.streamAdder.show(null, hub_id, (stream) => {
			const uuid = LB.Stream.uuid(stream.id);
			setTimeout(() => {
				StreamCore.addStream(uuid);
				streams.push(stream);
				this.setState({
					streams,
				});
			}, 1000);
		});
	};

	editStream = (currentStream) => {
		const streams = this.state.streams || [];
		const { hub_id } = this.props.params;
		this.streamAdder.show(currentStream, hub_id, (stream) => {
			const uuid = LB.Stream.uuid(stream.id);
			const idx = streams.findIndex((s) => s.id === stream.id);
			if (idx !== -1) {
				this.streamPlayer[idx].stopStream();
				StreamCore.reloadStream(uuid);
				setTimeout(() => {
					this.streamPlayer[idx].loadStream();
				}, 700);
				streams[idx] = stream;
				this.setState({
					streams,
				});
			}
		});
	};

	handleStreamPress = (stream) => {
		window.open(`/framer/${stream.id}`, '_blank').focus();
	}

	handleStreamDisable = async (streamId) => {
		const { streams } = this.state;
		const confirmed = window.confirm(
			"Are you sure you want to disable stream"
		);
		if (!confirmed) {
			return;
		}
		try {
			this.setState({
				busy: true,
			});
			const response = await RB.Stream.disableStream(streamId);
			if (response.success) {
				const uuid = LB.Stream.uuid(streamId);
				LB.Stream.deleteStream(uuid);
				const idx = streams.findIndex((s) => s.id === streamId);
				if (idx) {
					this.streamPlayer[idx].stopStream();
					streams.splice(idx, 1);
					this.setState({ streams });
				}
				StreamCore.removeStream(uuid);
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

	startStream = (streams) => {
		for (let stream of streams) {
			const uuid = LB.Stream.uuid(stream.id);
			StreamCore.addStream(uuid);
		}
		setTimeout(() => {
			this.setState({
				streams,
			});
		}, 800);
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

	renderLayout = () => {
		const { layoutConfig, streams } = this.state;
		const streamCount = streams?.length || 0;
		const streamLayoutKey = layoutConfig[streamCount];
		let Component = null;
		switch (streamLayoutKey) {
			case "one":
				return (
					<StreamPlayer
						data={streams[0]}
						width={helper.width - 2}
						height={contentHeight - 2}
						onEdit={() => this.editStream(streams[0])}
						ref={(ref) => (this.streamPlayer[0] = ref)}
						onPress={() => this.handleStreamPress(streams[0])}
					/>
				);
			case "two":
				Component = Two;
				break;
			case "three":
				Component = Three;
				break;
			case "threex1":
				Component = Threex1;
				break;
			case "four":
				Component = Four;
				break;
			case "fourx1":
				Component = Fourx1;
				break;
			case "fourx2":
				Component = Fourx2;
				break;
			case "five":
				Component = Five;
				break;
			case "six":
				Component = Six;
				break;
			case "sixx1":
				Component = Sixx1;
				break;
			case "sixx2":
				Component = Sixx2;
				break;
			case undefined:
				return null;
			default:
				return null;
		}
		return (
			<Component
				streams={streams}
				renderPlayer={(data, index, width, height) => (
					<StreamPlayer
						data={data}
						width={width}
						height={height}
						onEdit={() => this.editStream(data)}
						ref={(ref) => (this.streamPlayer[index] = ref)}
						onPress={() => this.handleStreamPress(data)}
					/>
				)}
			/>
		);
	};

	render() {
		const { hub, busy } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header title={hub.name} />
					<View style={style.content}>{this.renderLayout()}</View>
					<Footer
						onSettingPress={this.showSettings}
						onLogoutPress={this.logout}
						onCameraPress={this.addNewStream}
					/>
				</View>
				<StreamAdder
					onDisablePress={this.handleStreamDisable}
					ref={(ref) => (this.streamAdder = ref)}
				/>
				<Editor
					ref={ref => this.hubEditor = ref}
				/>
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
});

export default withRouter(HubHome);