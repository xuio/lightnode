const React = require('react');
const DefaultLayout = require('./layouts/default');

// react components
import { Alert, Button, Tooltip, Form, FormGroup, Label, Input } from 'reactstrap';

class ControllerView extends React.Component {
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
			<DefaultLayout title={this.props.title}>
				<div>
					{loginAlert}
					<Form action="login" method="post">
						<FormGroup>
							<Label for="inputUser">Email</Label>
							<Input type="text" name="username" id="inputUser" placeholder="Username" />
						</FormGroup>
						<FormGroup>
							<Label for="inputPassword">Password</Label>
							<Input type="password" name="password" id="inputPassword" placeholder="Password" />
						</FormGroup>
						<Button color="primary" type="submit">Login</Button>{' '}
					</Form>
				</div>
			</DefaultLayout>
		);
	}
}

module.exports = ControllerView;