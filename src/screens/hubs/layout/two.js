import React, { Component } from "react";
import {
	View
} from "react-native";
import style from "./style";
import constants from "./constants";

export default class Two extends Component {
	renderStream = (stream, index) => {
		const {  height, widthHalf } = constants(this.props.small);
		return (
			<View key={index} style={[style.video, { height: height, width: widthHalf }]}>
				{this.props.renderPlayer(stream, index, widthHalf, height)}
			</View>
		)
	}
	render(){
		const streams = this.props?.streams || [];
		return (
			<View style={style.row}>
				{streams.map(this.renderStream)}
			</View>
		)
	}
}