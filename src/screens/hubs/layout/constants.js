import helper from "../../../utils/helper";

const constants = (isSmall = false) => {
	const hhheight = isSmall ? 210 : helper.height;
	const wwwidth = isSmall ? 210 : helper.width;
	const cHeight = hhheight - 100;

	const height = cHeight;
	const heightHalf = cHeight / 2;
	const heightThird = cHeight / 3;
	const heightMore = cHeight - heightThird;

	const width = wwwidth;
	const widthHalf = wwwidth / 2;
	const widthThird = wwwidth / 3;
	const widthMore = wwwidth - widthThird;

	return {
		height,
		heightHalf,
		heightThird,
		heightMore,
		width,
		widthHalf,
		widthThird,
		widthMore,
	}
}
export default constants;