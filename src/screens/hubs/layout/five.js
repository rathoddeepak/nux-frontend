import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import {  heightHalf, widthThird } from "./constants";

export default class Five extends Component {
	render(){
		const streams = this.props?.streams || [];
		return (
			<View>
				<View style={style.row}>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[0], 0)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[1], 1)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[2], 2)}
					</View>
				</View>
				<View style={style.row}>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[3], 3)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[4], 4)}
					</View>
				</View>
			</View>
		)
	}
}