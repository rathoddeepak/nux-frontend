import React, { Component } from "react";
import {
	View,
	Pressable,
	StyleSheet
} from "react-native";
import colors from "../../themes/colors";
import FeatherIcons from 'feather-icons-react';

export default class Footer extends Component {
	render(){
		const {
			onHomePress,
			onHubPress,
			onSettingPress,
			onLogoutPress
		} = this.props;
		return (
			<View style={style.main}>
				<Pressable onPress={onHomePress} style={style.icon}>
					<FeatherIcons
						icon={'home'}
						color={colors.white}
					/>
				</Pressable>
				<Pressable onPress={onHubPress} style={style.icon}>
					<FeatherIcons
						icon={'command'}
						color={colors.silver}
					/>
				</Pressable>
{/*				<Pressable onPress={onSettingPress} style={style.icon}>
					<FeatherIcons
						icon={'settings'}
						color={colors.silver}
					/>
				</Pressable>*/}
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