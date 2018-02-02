import React from 'react';
import ReactDOM from 'react-dom';

import './styles/index.css';
import './styles/normalize.css';

import SketchFace from './components/sketchFace';

import registerServiceWorker from './registerServiceWorker';

var paper = require('paper');

const canvas = document.getElementById('sketchCanvas');
paper.setup(canvas);

ReactDOM.render(<SketchFace canvasWidth={canvas.clientWidth} />, document.getElementById('controls'));

registerServiceWorker();
