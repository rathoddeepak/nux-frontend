import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import constants from "./constants";

export default class Five extends Component {
	render(){
		const streams = this.props?.streams || [];
		const {  heightHalf, widthThird } = constants(this.props.small);
		return (
			<View>
				<View style={style.row}>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[0], 0, widthThird, heightHalf)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[1], 1, widthThird, heightHalf)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[2], 2, widthThird, heightHalf)}
					</View>
				</View>
				<View style={style.row}>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[3], 3, widthThird, heightHalf)}
					</View>
					<View style={[style.video, { height: heightHalf, width: widthThird }]}>
						{this.props.renderPlayer(streams[4], 4, widthThird, heightHalf)}
					</View>
				</View>
			</View>
		)
	}
}