import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import {  heightHalf, widthHalf } from "./constants";

export default class Four extends Component {
	render(){
		const streams = this.props?.streams || [];
		return (
			<View style={style.row}>
				<View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[0], 0, widthHalf, heightHalf)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[1], 1, widthHalf, heightHalf)}
					</View>
				</View>
				<View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[2], 2, widthHalf, heightHalf)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[3], 3, widthHalf, heightHalf)}
					</View>
				</View>
			</View>
		)
	}
}