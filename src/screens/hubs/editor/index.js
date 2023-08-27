import React, { Component } from "react";
import { View, Text, Modal, Pressable } from "react-native";
import Classes from "./classes";
import Layout from "./layout";
import FeatherIcons from "feather-icons-react";
import Loading from "../../../components/loading";
import colors from "../../../themes/colors";
import helper from "../../../utils/helper";
import RB from "../../../backend/remote/";

const contentHeight = helper.height * 0.5;
const contentWidth = helper.width * 0.5;

const tabs = [
	{
		id: 1,
		name: "Classes",
	},
	{
		id: 2,
		name: "Layout",
	},
];
export default class Editor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			currentTab: 0,
			busy: false,
			classes: [],
		};
		this.callback = null;
	}

	show = ({ classes, layout, hubId }, cb) => {
		this.setState({
			classes,
			layout,
			hubId,
			visible: true,
		});
		this.callback = cb;
	};

	close = () => {
		if (this.state.busy) return;
		this.setState(
			{
				visible: false,
			},
			() => {
				this.callback = null;
			}
		);
	};

	handleSubmitClass = async (classes) => {
		try {
			this.setState({
				busy: true,
			});
			const { hubId } = this.state;
			const response = await RB.Hub.updateClasses({
				classes,
				hubId,
			});
			if (response.success) {
				helper.showToast("Saved Successfully");
				this.callback({
					classes,
					isClass: true,
				});
				setTimeout(() => {
					this.close();
				}, 100);
			} else {
				throw new Error(response?.message || helper.errorText);
			}
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false,
			});
		}
	};

	handleSubmitLayout = async (layout) => {
		try {
			this.setState({
				busy: true,
			});
			const { hubId } = this.state;
			const response = await RB.Hub.updateLayout({
				layout,
				hubId,
			});
			if (response.success) {
				helper.showToast("Saved Successfully");
				this.callback({
					layout,
					isLayout: true,
				});
				setTimeout(() => {
					this.close();
				}, 100);
			} else {
				throw new Error(response?.message || helper.errorText);
			}
		} catch (err) {
			helper.showToast(err.message, "error");
		} finally {
			this.setState({
				busy: false,
			});
		}
	};

	renderTab = (tab, index) => {
		const { currentTab } = this.state;
		const selected = currentTab === index;
		return (
			<Pressable
				onPress={() => this.setState({ currentTab: index })}
				style={style.tabOption}
				key={index}
			>
				<View style={[style.seleced, { opacity: selected ? 1 : 0 }]} />
				<Text style={style.tabText}>{tab.name}</Text>
			</Pressable>
		);
	};

	renderContent = () => {
		const { currentTab, layout, classes } = this.state;
		if (currentTab === 0) {
			return (
				<Classes onSubmit={this.handleSubmitClass} classes={classes} />
			);
		}
		return <Layout onSubmit={this.handleSubmitLayout} layout={layout} />;
	};

	render() {
		const { visible, busy } = this.state;
		return (
			<Modal
				visible={visible}
				transparent
				onRequestClose={this.close}
				animationType="fade"
			>
				<View style={style.main}>
					<View style={style.content}>
						<View style={style.tabCover}>
							<View style={style.tabHeader}>
								<Text style={style.tabText}>Hub Settings</Text>
							</View>
							{tabs.map(this.renderTab)}
						</View>
						<View style={style.tabContent}>
							<View style={style.tabHeader}>
								<Pressable onPress={this.close} style={style.closeIcon}>
									<FeatherIcons
										color={colors.white}
										size={20}
										icon="x"
									/>
								</Pressable>
							</View>
							{this.renderContent()}
						</View>
						<Loading busy={busy} />
					</View>
				</View>
			</Modal>
		);
	}
}

const style = {
	main: {
		height: helper.height,
		width: helper.width,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#000000b4",
	},
	content: {
		borderRadius: 10,
		flexDirection: "row",
		height: contentHeight,
		width: contentWidth,
		borderWidth: 1,
		overflow: "hidden",
		borderColor: colors.borderColor,
		backgroundColor: colors.background3,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		width: 290,
		color: colors.silver,
	},
	desc: {
		fontSize: 14,
		width: 290,
		marginTop: 3,
		color: colors.silver,
	},
	input: {
		width: 290,
		height: 40,
		paddingLeft: 5,
		borderRadius: 6,
		marginTop: 15,
		fontSize: 15,
		borderWidth: 1,
		borderColor: colors.borderColor,
		color: colors.white,
		backgroundColor: colors.background,
		outline: "none",
	},
	button: {
		width: 290,
		height: 40,
		marginTop: 15,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 5,
		backgroundColor: colors.primary,
	},
	buttonTxt: {
		fontSize: 16,
		fontWeight: "bold",
	},
	cancel: {
		backgroundColor: colors.background2,
	},
	tabCover: {
		width: "30%",
		height: "100%",
		backgroundColor: colors.background,
	},
	tabContent: {
		width: "70%",
		height: "100%",
	},
	tabHeader: {
		height: 40,
		width: "100%",
		borderBottomWidth: 1,
		backgroundColor: colors.background,
		paddingLeft: 10,
		borderColor: colors.borderColor,
		justifyContent: "center",
	},
	seleced: {
		height: 40,
		width: 3,
		backgroundColor: colors.primary,
		borderTopRightRadius: 10,
		borderBottomRightRadius: 10,
	},
	tabOption: {
		flexDirection: "row",
		height: 40,
		alignItems: "center",
		marginVertical: 10,
	},
	tabText: {
		fontSize: 15,
		paddingLeft: 10,
		color: colors.white,
		fontWeight: "bold",
	},
	closeIcon: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		alignSelf: "flex-end"
	},
};