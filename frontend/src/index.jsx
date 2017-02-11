// Import React and React-dom.
import React from 'react';
import ReactDOM from 'react-dom';

// diffsync
import {Client} from 'diffsync';
import socketIOClient from 'socket.io-client';

// import styles
import '../../node_modules/bootstrap/scss/bootstrap.scss';
import '../../node_modules/tether/dist/css/tether.min.css';

import '../scss/main.scss';

// Import the components.
import { MainComponent } from './components/main.jsx';

// DiffSync wrapper
const WithDiffSync = (ComposedComponent, {client, onError}) => class extends React.Component {
	diffSyncState = {};

	componentDidMount() {
		client.on('connected', () => {
			this.diffSyncState = client.getData();
			this.forceUpdate();
		});

		client.on('synced', () => {
			this.forceUpdate();
		});

		if (onError) {
			client.on('error', onError);
		}
	}

	setDiffSyncState(fn) {
		fn(this.diffSyncState);

		client.schedule();
	}

	render() {
		return (
			<ComposedComponent
				{...this.diffSyncState}
				{...this.props}
				setDiffSyncState={this.setDiffSyncState.bind(this)}
			/>
		);
	}
};

const main = () => {
	const client = new Client(socketIOClient());

	const DiffSyncedMain = WithDiffSync(MainComponent, {client});

	client.initialize();

	ReactDOM.render(<DiffSyncedMain />, document.getElementById('container'));
}

main();
