import React, { Component } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

import Header from "../../components/header/";
import StreamPlayer from "../../components/player/";

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
import Footer from "./footer";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import StreamCore from "../../libs/streamCore";

const layouts = {
	1: "one",
	2: "two",
	3: "three",
	4: "four",
	5: "five",
	6: "six",
};

const contentHeight = helper.height - 100;

export default class StationHome extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hub: {
				name: "Mandir Gate",
			},
			layoutConfig: layouts,
			streams: [],
			streamWidth: 0,
			streamHeight: 0,
		};
	}

	componentDidMount() {
		setTimeout(() => {
			this.startStream();
		}, 500);
	}

	startStream = () => {
		const streams = [
			{
				id: 1,
				uuid: "54562a6c-5a0e-4eb2-a73b-e0f1a6be8825"
			},
			{
				id: 2,
				uuid: "54562a6c-5a0e-4eb2-a73b-e0f1a6be8825"
			},
			{
				id: 3,
				uuid: "54562a6c-5a0e-4eb2-a73b-e0f1a6be8825"
			},
			{
				id: 4,
				uuid: "54562a6c-5a0e-4eb2-a73b-e0f1a6be8825"
			},
		];
		for(let stream of streams){
			StreamCore.addStream(stream.uuid);
		}
		setTimeout(() => {
			this.setState({
				streams
			})
		}, 800);
	};

	renderLayout = () => {
		const { layoutConfig, streams } = this.state;
		const streamCount = streams?.length || 0;
		const streamLayoutKey = layoutConfig[streamCount];
		console.log(streamLayoutKey);
		switch (streamLayoutKey) {
			case "one":
				return (
					<StreamPlayer
					 data={streams[0]}
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
					 onPress={() => this.handleStreamPress(data)}
					/>
			 	)}
			/>
		)
	};

	render() {
		const { hub } = this.state;
		return (
			<>
				<View style={style.main}>
					<Header title={hub.name} />
					<View style={style.content}>
						{this.renderLayout()}
					</View>
					<Footer onHubPress={this.addNewHub} />
				</View>
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