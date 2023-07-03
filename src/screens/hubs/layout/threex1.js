import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import { height, heightHalf, widthHalf } from "./constants";

export default class Threex1 extends Component {
	render(){
		const streams = this.props?.streams || [];
		return (
			<View style={style.row}>
				<View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[1], 1)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthHalf }]}>
						{this.props.renderPlayer(streams[2], 2)}
					</View>
				</View>
				<View style={[style.video, { height, width: widthHalf }]}>
					{this.props.renderPlayer(streams[0], 0)}
				</View>				
			</View>
		)
	}
}