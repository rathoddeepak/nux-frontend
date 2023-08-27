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
		const {
			onCameraPress,
			onLogoutPress,
			onSettingPress
		} = this.props;
		return (
			<View style={style.main}>
				<Pressable style={style.icon}>
					<FeatherIcons
						icon={'home'}
						color={colors.white}
					/>
				</Pressable>
				<Pressable  onPress={onCameraPress} style={style.icon}>
					<FeatherIcons
						icon={'plus-circle'}
						color={colors.silver}
					/>
				</Pressable>
				<Pressable  onPress={onSettingPress} style={style.icon}>
					<FeatherIcons
						icon={'settings'}
						color={colors.silver}
					/>
				</Pressable>
				<Pressable onPress={onLogoutPress} style={style.icon}>
					<FeatherIcons
						icon={'log-out'}
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
		width: helper.width,
		borderColor: colors.borderColor,
		borderTopWidth: 1,
		top: -1,
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