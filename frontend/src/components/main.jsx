import React from 'react';
import { Alert, Button, Container } from 'reactstrap';
import { Navigation } from './partials/navigation.jsx';
import { Channel } from './partials/channel.jsx';

// diffsync
import {Client} from 'diffsync';
import socketIOClient from 'socket.io-client';

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
