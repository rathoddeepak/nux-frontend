import React from "react";
import {
	View,
	Text,
	StyleSheet
} from "react-native";
import FeatherIcons from 'feather-icons-react';
import colors from "../../themes/colors";
import helper from "../../utils/helper";
import { APP_NAME } from "../../utils/constants";
const Header = ({ title = '', icon = 'aperture'}) => {
	return (
		<View style={style.main}>
			<View style={style.icon}>
				<FeatherIcons
					icon={icon}
					size={20}
					color={colors.white}
				/>
			</View>
			<Text style={style.text}>
				{APP_NAME} | {title.toUpperCase()}
			</Text>
		</View>
	)
}

const style = StyleSheet.create({
	main: {
		backgroundColor: colors.background,
		height: 50,
		width: helper.width,
		flexDirection: "row",
		paddingLeft: 10,
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: colors.borderColor
	},
	icon: {
		width: 50,
		height: 50,
		justifyContent: 'center',
		alignItems: 'center'
	},
	text: {
		fontSize: 18,
		fontWeight: 'bold',
		color: colors.white
	}
});

export default Header;