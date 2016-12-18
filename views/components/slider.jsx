const React = require('react');

import Slider from 'react-rangeslider';
import ReactSliderNativeBootstrap from 'react-bootstrap-native-slider';

class sliderCom extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			value: 10 /** Start value **/
		};
	}

	handleChange = (value) => {
		this.setState({
			value: value
		});
	}
	render() {
		let loginAlert;
		// display alert if login failed
		if(this.props.loginFailed){
			loginAlert =
			<Alert color="danger">
				Login Failed!
			</Alert>
		}
		return (
			<ReactSliderNativeBootstrap
			value={this.state.currentValue}
			handleChange={this.changeValue}
			step={this.state.step}
			max={this.state.max}
			min={this.state.min}
			disabled="disabled" />
		);
	}
}

module.exports = slider;
