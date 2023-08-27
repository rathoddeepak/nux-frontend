import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import constants from "./constants";

export default class Threex1 extends Component {
	render(){
		const streams = this.props?.streams || [];
		const {  height, heightHalf, widthHalf } = constants(this.props.small);
		return (
			<View style={style.row}>
				<View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[1], 1, widthHalf, heightHalf)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[2], 2, widthHalf, heightHalf)}
					</View>
				</View>
				<View style={[style.video, { height, width: widthHalf }]}>
					{this.props.renderPlayer(streams[0], 0, widthHalf, height)}
				</View>				
			</View>
		)
	}
}