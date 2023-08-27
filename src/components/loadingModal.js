import React from 'react';
import { View, Modal, ActivityIndicator } from "react-native";
import colors from "../themes/colors";
import helper from "../utils/helper";

const LoadingModal = ({ busy = true } = {}) => {
	return (
		<Modal visible={busy} transparent animationType="fade">
			<View style={style.main}>
				<ActivityIndicator size={35} color={colors.primary} />
			</View>
		</Modal>
	)
}

const style = {
	main: {
		justifyContent: "center",
		alignItems: "center",
		width: helper.width,
		height: helper.height,
		backgroundColor: "#000000b4"
	}
}

export default LoadingModal;