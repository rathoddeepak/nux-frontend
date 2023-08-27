import React from 'react';
import { View, ActivityIndicator } from "react-native";
import colors from "../themes/colors";

const Loading = ({ busy = true } = {}) => {
	return busy ? (
		<View style={style.main}>
			<ActivityIndicator size={35} color={colors.primary} />
		</View>
	) : null;
}

const style = {
	main: {
		justifyContent: "center",
		alignItems: "center",
		width: "110%",
		height: "110%",
		position: "absolute",
		top: -10,
		left: -10,
		backgroundColor: "#000000b4"
	}
}

export default Loading;