import React, { Component } from "react";
import { View, StyleSheet } from "react-native";
import LoadingModal from "../../components/loadingModal";
import Header from "../../components/header/";
import FrameView from "../../components/player/frame";
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

import RB from "../../backend/remote/";
import DB from "../../db/";

import colors from "../../themes/colors";
import helper from "../../utils/helper";

const layouts = {
	1: "one",
	2: "two",
	3: "three",
	4: "four",
	5: "five",
	6: "six",
};

const contentHeight = helper.height - 100;

class StationHome extends Component {
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

	componentDidMount() {
		const { hub_id } = this.props.params || {};
		const stationId = DB.Account.getStationId();
		if (!stationId || !hub_id){
			this.props.navigate("/login");
			return
		}
		this.loadHubData();
	}

	loadHubData = async () => {
		try {
			const { hub_id } = this.props.params;
			this.setState({ busy: true });
			const response = await RB.Hub.hubData(hub_id);
			if (response.success) {
				const data = response.data;
				const hub = {
					id: data.id,
					name: data.name,
					classes: data.classes,
					layout: data.layout
				};
				this.setState({ hub, layoutConfig: data.layout }, this.loadLatestFrame);
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

	loadLatestFrame = async () => {
		try {
			const { hub_id } = this.props.params;
			this.setState({ loading: true });
			const response = await RB.Stream.lastestStreamFrame(hub_id);
			if (response.success) {				
				this.setState({ frames: response.data });
			} else {
				throw new Error(response?.message || helper.reload_page);
			}
		} catch (err) {
			//
		} finally {
			this.setState({
				loading: false,
			});
			setTimeout(() => {
				this.loadLatestFrame();
			}, 3000);
		}
	};

	handleStreamPress = (stream) => {
		window.open(`/framer/${stream.id}`, "_blank").focus();
	};

	renderLayout = () => {
		const { layoutConfig, frames } = this.state;
		const streamCount = frames?.length || 0;
		const streamLayoutKey = layoutConfig[streamCount];
		let Component = null;
		switch (streamLayoutKey) {
			case "one":
				return (
					<FrameView
						data={frames[0]}
						width={helper.width - 2}
						height={contentHeight - 2}
						ref={(ref) => (this.streamPlayer[0] = ref)}
						onPress={() => this.handleStreamPress(frames[0])}
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
				streams={frames}
				renderPlayer={(data, index, width, height) => (
					<FrameView
						data={data}
						width={width}
						height={height}
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
					<View style={style.footer} />
				</View>
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
	footer: {
		backgroundColor: colors.background,
		width: "100%",
		height: 50
	}
});

export default withRouter(StationHome);