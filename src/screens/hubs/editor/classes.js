import React, { Component } from "react";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from '@mui/material/Button';
import Checkbox from "@mui/material/Checkbox";
import Snackbar from '@mui/material/Snackbar';

const defaultClasses = ['person', 'car', 'bicycle'];
export default class Classes extends Component {
	constructor(props) {
		super(props);
		this.state = {
			classes: {},
			snackOpen: false
		};
	}
	componentDidMount(){
		const { classes } = this.props;		
		const classMap = {};
		for(let className of classes){
			classMap[className] = true;
		}
		this.setState({
			classes: classMap
		})
	}
	handleChange = (name, checked) => {
		const classMap = this.state.classes;
		classMap[name] = checked;
		this.setState({
			classes: classMap
		});
	}
	handleSubmit = () => {
		const classMap = this.state.classes;
		const classes = [];
		for(let key of Object.keys(classMap)){
			if(classMap[key]){
				classes.push(key);
			}
		}
		if(classes.length === 0){
			this.setState({
				snackOpen: true
			})
			return;
		}
		this.props.onSubmit(classes);
	}
	render() {
		const { classes, snackOpen } = this.state;
		return (
			<Box sx={{ display: "flex" }}>
				<FormControl
					sx={{ m: 3 }}
					component="fieldset"
					variant="standard"
				>
					<FormLabel component="legend">
						Select Detection Classes
					</FormLabel>
					<FormGroup>
						{defaultClasses.map((className, index) => {
							return (
								<FormControlLabel
									key={index}
									control={
										<Checkbox
											checked={classes[className] || false}
											onChange={() =>
												this.handleChange(
													className,
													!classes[className]
												)
											}
											name={className}
										/>
									}
									label={className}
								/>
							);
						})}
					</FormGroup>
					<Button onClick={this.handleSubmit} variant="outlined">Save Classes</Button>
					<Snackbar
					  open={snackOpen}
					  autoHideDuration={6000}
					  onClose={() => this.setState({ snackOpen: false })}
					  message="Atleast one class is needed"
					/>
				</FormControl>
			</Box>
		);
	}
}