// Import React and React-dom.
import React from 'react';
import ReactDOM from 'react-dom';

// import styles
import '../../node_modules/bootstrap/scss/bootstrap.scss';
import '../../node_modules/tether/dist/css/tether.min.css';

import '../scss/main.scss';

// Import the components.
import { MainComponent } from './components/main.jsx';

// Define the root element.
const root = document.querySelector('main');

// Append the MainComponent to the root element.
ReactDOM.render(<MainComponent />, root);
