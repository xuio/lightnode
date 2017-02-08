import React from 'react';
import { Alert, Button, Container } from 'reactstrap';
import { Navigation } from './partials/navigation.jsx';
import { Channel } from './partials/channel.jsx';

export class MainComponent extends React.Component {
	render () {
		return (
			<div>
				<Navigation />
				<Container>
					<Channel />
					<Channel />
					<Channel />
					<Channel />
					<Channel />
					<Channel />
					<Channel />
					<Channel />
				</Container>
			</div>
		)
	}
}
