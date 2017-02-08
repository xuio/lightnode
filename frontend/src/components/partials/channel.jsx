import React from 'react';
import { ColorPickerButton } from './colorPickerButton.jsx';
import { Button, ButtonGroup, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

export class Channel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			active: false,
			animationActive: false,
			effect: 1,
			animDropdown: false,
			color: {
				r: 0,
				g: 0,
				b: 0,
				a: 1,
			}
		};
		this.handleToggle = this.handleToggle.bind(this);
		this.handleAnimToggle = this.handleAnimToggle.bind(this);
		this.toggleAnimDropdown = this.toggleAnimDropdown.bind(this);
	}

	handleToggle() {
		this.setState({ active: !this.state.active });
	};

	handleAnimToggle() {
		this.setState({ animationActive: !this.state.animationActive });
	};

	toggleAnimDropdown() {
		this.setState({ animDropdown: !this.state.animDropdown });
	};

	render() {
		return (
			<div>
				<ButtonGroup>
					<Button color={ this.state.active ? 'success':'danger' } onClick={ this.handleToggle }><i className="fa fa-power-off"></i></Button>
					<ColorPickerButton updateColor={ (color) => { this.setState({ color: color }) } } />
					<ButtonDropdown isOpen={this.state.animDropdown} toggle={this.toggleAnimDropdown}>
						<Button color="secondary" onClick={ this.handleAnimToggle }><i className={ `fa fa-${this.state.animationActive ? 'play':'pause'}` }></i></Button>
						<DropdownToggle caret>
							<i className="fa fa-magic"></i> { this.state.effect }
						</DropdownToggle>
						<DropdownMenu>
							<DropdownItem>1</DropdownItem>
							<DropdownItem>2</DropdownItem>
							<DropdownItem>3</DropdownItem>
						</DropdownMenu>
					</ButtonDropdown>
				</ButtonGroup>
				<br />
				<h6>{ JSON.stringify(this.state.color) }</h6>
			</div>
		);
	}
}
