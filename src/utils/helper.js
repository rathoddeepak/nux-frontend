import { Dimensions } from "react-native";
import toast from "react-hot-toast";
const { width, height } = Dimensions.get("window");
const showToast = (text, type = "success") => {
	toast[type](text, {
		style: {
			borderRadius: "10px",
			background: "#333",
			color: "#fff",
		},
	});
};
const helper = {
	width,
	height,
	showToast,
	errorText: "Something went wrong!"
};

export default helper;