import React from 'react';
import reactCSS from 'reactcss';
import { ChromePicker } from 'react-color';
import { Button } from 'reactstrap';

export class ColorPickerButton extends React.Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.state = {
			displayColorPicker: false,
			color: {
				r: '241',
				g: '112',
				b: '19',
				a: '1',
			},
			text: 255,
		};
	}

	handleClick() {
		this.setState({ displayColorPicker: !this.state.displayColorPicker });
	};

	handleClose() {
		this.setState({ displayColorPicker: false });
	};

	handleChange(color) {
		// update state
		this.setState({ color: color.rgb });
		// notify parent
		this.props.updateColor(color.rgb);
		const avg = ((color.rgb.r + color.rgb.g + color.rgb.b) / 3);
		if(avg < 180){
			this.setState({text: 255});
		} else {
			this.setState({text: 10});
		}
	};

	render() {
		const styles = reactCSS({
			'default': {
				popover: {
					position: 'absolute',
					zIndex: '2',
				},
				cover: {
					position: 'fixed',
					top: '0px',
					right: '0px',
					bottom: '0px',
					left: '0px',
				},
				button: {
					transition: 'all 0.2s ease-in-out, border-color 1ms, background-color 1ms',
					backgroundColor: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
					borderColor: `rgba(${ this.state.color.r }, ${ this.state.color.g }, ${ this.state.color.b }, ${ this.state.color.a })`,
					borderRadius: '0px',
				},
				buttonText: {
					color: `rgb(${ this.state.text }, ${ this.state.text }, ${ this.state.text })`,
				},
			},
		});

		return (
			<div>
				<Button className={ `colorPickerButton${this.state.displayColorPicker ? ' buttonActive':''}` } style={ styles.button } onClick={ this.handleClick }>
					<span style={ styles.buttonText }><i className="fa fa-tint"></i></span>
				</Button>
					{ this.state.displayColorPicker ? <div style={ styles.popover }>
					<div style={ styles.cover } onClick={ this.handleClose }/>
					<ChromePicker disableAlpha={ true } color={ this.state.color } onChange={ this.handleChange } />
				</div> : null }
			</div>
		)
	}
}

//ColorPickerButton = Radium(ColorPickerButton);
