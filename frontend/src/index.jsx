// Import React and React-dom.
import React from 'react';
import ReactDOM from 'react-dom';

// import styles
import '../../node_modules/bootstrap/scss/bootstrap.scss';
import '../scss/login.scss';
// Import the components.
import { DummyComponent } from './components/dummy-component.jsx';

// Define the root element.
const root = document.querySelector('main');

// Append the DummyComponent to the root element.
ReactDOM.render(<DummyComponent />, root);
