import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import constants from "./constants";

export default class Sixx2 extends Component {
	render(){
		const streams = this.props?.streams || [];
		const {  heightThird, widthThird, heightMore, widthMore } = constants(this.props.small);
		return (
			<View style={style.row}>				
				<View>
					<View style={[style.video, { height: heightThird, width: widthThird }]}>
						{this.props.renderPlayer(streams[1], 1, widthThird, heightThird)}
					</View>
					<View style={[style.video, { height: heightThird, width: widthThird }]}>
						{this.props.renderPlayer(streams[2], 2, widthThird, heightThird)}
					</View>
					<View style={[style.video, { height: heightThird, width: widthThird }]}>
						{this.props.renderPlayer(streams[3], 3, widthThird, heightThird)}
					</View>
				</View>
				<View>
					<View style={[style.video, { height: heightMore, width: widthMore }]}>
						{this.props.renderPlayer(streams[0], 0, widthMore, heightMore)}
					</View>
					<View style={style.row}>
						<View style={[style.video, { height: heightThird, width: widthThird }]}>
							{this.props.renderPlayer(streams[4], 4, widthThird, heightThird)}
						</View>
						<View style={[style.video, { height: heightThird, width: widthThird }]}>
							{this.props.renderPlayer(streams[5], 5, widthThird, heightThird)}
						</View>
					</View>
				</View>
			</View>
		)
	}
}