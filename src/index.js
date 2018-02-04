import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import './styles/normalize.css';

import SketchFace from './components/SketchFace';

import registerServiceWorker from './registerServiceWorker';

// import refphoto from './images/reference.png';

var paper = require('paper');

const canvas = document.getElementById('sketchCanvas');
paper.setup(canvas);
// canvas.style.background = "url(" + refphoto + ")";

ReactDOM.render(<SketchFace />, document.getElementById('controls'));

registerServiceWorker();
