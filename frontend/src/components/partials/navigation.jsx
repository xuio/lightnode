import React from 'react';
import { NavDropdown, DropdownItem, DropdownToggle, DropdownMenu, Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

export class Navigation extends React.Component {
	constructor(props) {
		super(props);

		this.toggleBar = this.toggleBar.bind(this);
		this.toggleDropdown = this.toggleDropdown.bind(this);
		this.state = {
			isOpen: false,
			dropdownOpen: false
		};
	}
	toggleBar() {
		this.setState({
			isOpen: !this.state.isOpen,
		});
	}
	toggleDropdown() {
		this.setState({
			dropdownOpen: !this.state.dropdownOpen,
		});
	}
	render() {
		return (
			<div>
				<Navbar color="faded" light toggleable>
					<NavbarToggler right onClick={this.toggleBar} />
					<NavbarBrand href="#">LightNode</NavbarBrand>
					<Collapse isOpen={this.state.isOpen} navbar>
						<Nav className="ml-auto" navbar>
							<NavItem>
								<NavLink href="/controller">Controller</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/animations">Animations</NavLink>
							</NavItem>
							<NavItem>
								<NavLink href="/settings"><i className="fa fa-cog"></i></NavLink>
							</NavItem>
							<NavDropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
								<DropdownToggle nav caret>
									<i className="fa fa-user"></i>
								</DropdownToggle>
								<DropdownMenu right>
									<DropdownItem>
										<NavLink href="/logout">
											<i className="fa fa-sign-out"></i> Logout
										</NavLink>
									</DropdownItem>
									<DropdownItem>
										<NavLink href="/user/setting">
											<i className="fa fa-cog"></i> Settings
										</NavLink>
									</DropdownItem>
								</DropdownMenu>
							</NavDropdown>
						</Nav>
					</Collapse>
				</Navbar>
			</div>
		);
	}
}
