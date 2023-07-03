import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import {  widthThird, heightThird, widthMore, heightMore } from "./constants";

export default class Sixx1 extends Component {
	render(){
		const streams = this.props?.streams || [];
		return (
			<View style={style.row}>
				<View>
					<View style={[style.video, { height: heightMore, width: widthMore }]}>
						{this.props.renderPlayer(streams[0], 0)}
					</View>
					<View style={style.row}>
						<View style={[style.video, { height: heightThird, width: widthThird }]}>
							{this.props.renderPlayer(streams[4], 4)}
						</View>
						<View style={[style.video, { height: heightThird, width: widthThird }]}>
							{this.props.renderPlayer(streams[5], 5)}
						</View>
					</View>
				</View>
				<View>
					<View style={[style.video, { height: heightThird, width: widthThird }]}>
						{this.props.renderPlayer(streams[1], 1)}
					</View>
					<View style={[style.video, { height: heightThird, width: widthThird }]}>
						{this.props.renderPlayer(streams[2], 2)}
					</View>
					<View style={[style.video, { height: heightThird, width: widthThird }]}>
						{this.props.renderPlayer(streams[3], 3)}
					</View>
				</View>
			</View>
		)
	}
}