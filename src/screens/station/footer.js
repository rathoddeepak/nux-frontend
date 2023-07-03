import React, { Component } from "react";
import {
	View,
	Pressable,
	StyleSheet
} from "react-native";
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import FeatherIcons from 'feather-icons-react';

export default class Footer extends Component {
	render(){
		return (
			<View style={style.main}>
				<Pressable style={style.icon}>
					<FeatherIcons
						icon={'home'}
						color={colors.white}
					/>
				</Pressable>
				<Pressable style={style.icon}>
					<FeatherIcons
						icon={'command'}
						color={colors.silver}
					/>
				</Pressable>
				<Pressable style={style.icon}>
					<FeatherIcons
						icon={'user'}
						color={colors.silver}
					/>
				</Pressable>
			</View>
		)
	}
}

const style = StyleSheet.create({
	main: {
		height: 50,
		alignSelf: 'center',
		borderColor: colors.borderColor,
		borderTopWidth: 1,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderBottomWidth: 0,
		top: -1,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		backgroundColor: colors.background,
		flexDirection: "row",
		justifyContent: 'center',
		alignItems: "center"
	},
	icon: {
		width: 100,
		height: 50,
		justifyContent: "center",
		alignItems: 'center'
	}
})