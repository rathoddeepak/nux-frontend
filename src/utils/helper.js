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

const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
	var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
	return { width: parseInt(srcWidth*ratio), height: parseInt(srcHeight*ratio) };
};

const helper = {
	width,
	height,
	showToast,
	calculateAspectRatioFit,
	errorText: "Something went wrong!",
	reloadPage: "Please reload page!"
};

export default helper;