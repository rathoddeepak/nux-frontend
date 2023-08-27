import * as React from "react";
import { View, Pressable } from "react-native";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FeatherIcons from "feather-icons-react";
import Two from "../layout/two";
import Three from "../layout/three";
import Threex1 from "../layout/threex1";
import Four from "../layout/four";
import Fourx1 from "../layout/fourx1";
import Fourx2 from "../layout/fourx2";
import Five from "../layout/five";
import Six from "../layout/six";
import Sixx1 from "../layout/sixx1";
import Sixx2 from "../layout/sixx2";
import colors from "../../../themes/colors";

const layouts = {
	1: ["one"],
	2: ["two"],
	3: ["three", "threex1"],
	4: ["four", "fourx1", "fourx2"],
	5: ["five"],
	6: ["six", "sixx1", "sixx2"],
};
function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box sx={{ p: 3 }}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

export default function Layout(props) {
	const [value, setValue] = React.useState(0);
	const [layout, setLayout] = React.useState(props.layout);

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const updateLayout = (streamCount, name) => {
		let ly = {...layout};
		ly[`${streamCount}`] = name;
		setLayout(ly);
	};

	const renderLayout = (layoutName, i, streamCount) => {
		let Component = null;
		const selected = layout[`${streamCount}`] === layoutName;
		switch (layoutName) {
			case "one":
				return (
					<View
						style={{
							width: 100,
							height: 100,
							borderWidth: 1,
							borderColor: colors.borderColor,
						}}
					>
						{selected ? (
							<View style={style.selectedIcon}>
								<FeatherIcons
									icon="check"
									color={colors.white}
									size={20}
								/>
							</View>
						) : null}
					</View>
				);
			case "two":
				Component = Two;
				break;
			case "three":
				Component = Three;
				break;
			case "threex1":
				Component = Threex1;
				break;
			case "four":
				Component = Four;
				break;
			case "fourx1":
				Component = Fourx1;
				break;
			case "fourx2":
				Component = Fourx2;
				break;
			case "five":
				Component = Five;
				break;
			case "six":
				Component = Six;
				break;
			case "sixx1":
				Component = Sixx1;
				break;
			case "sixx2":
				Component = Sixx2;
				break;
			case undefined:
				return null;
			default:
				return null;
		}
		return (
			<Pressable
				onPress={() => {
					updateLayout(streamCount, layoutName);
				}}
				style={style.box}
			>
				<Component
					streams={layouts[streamCount]}
					small={true}
					renderPlayer={(data, index, width, height) => (
						<View style={[style.box, { width, height }]} />
					)}
				/>
				{selected ? (
					<View o style={style.selectedIcon}>
						<FeatherIcons
							icon="check"
							color={colors.white}
							size={20}
						/>
					</View>
				) : null}
			</Pressable>
		);
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label="S3" />
					<Tab label="S4" />
					<Tab label="S5" />
					<Tab label="S6" />
				</Tabs>
			</Box>
			<CustomTabPanel value={value} index={0}>
				<View style={style.row}>
					{layouts[3].map((d, i) => renderLayout(d, i, 3))}
				</View>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={1}>
				<View style={style.row}>
					{layouts[4].map((d, i) => renderLayout(d, i, 4))}
				</View>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={2}>
				<View style={style.row}>
					{layouts[5].map((d, i) => renderLayout(d, i, 5))}
				</View>
			</CustomTabPanel>
			<CustomTabPanel value={value} index={3}>
				<View style={style.row}>
					{layouts[6].map((d, i) => renderLayout(d, i, 6))}
				</View>
			</CustomTabPanel>	

			<Pressable onPress={() => {
				props.onSubmit(layout)
			}} style={style.saveButton}>
				<FeatherIcons
					icon='check'
					color={colors.white}
					size={20}
				/>
			</Pressable>
		</Box>
	);
}

const style = {
	box: {
		borderWidth: 0.5,
		marginRight: 10,
		overflow: "hidden",
		borderColor: "#505050",
		marginBottom: 20,
		width: 210,
	},
	row: {
		width: "100%",
		flexDirection: "row",
		flexWrap: "wrap",
		justifyContent: "space-between",
	},
	selectedIcon: {
		position: "absolute",
		top: 10,
		right: 10,
		width: 30,
		height: 30,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: colors.white,
		backgroundColor: colors.green,
		borderRadius: 100,
	},
	saveButton: {
		position: "absolute",
		width: 40,
		height: 40,
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
		right: 10,
		bottom: 10,
		backgroundColor: colors.primary
	}
};