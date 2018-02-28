import React from 'react';
import ReactDOM from 'react-dom';

import './styles/normalize.css';
import './styles/index.css';

import SketchFace from './components/SketchFace';

import registerServiceWorker from './registerServiceWorker';

var paper = require('paper');

const canvas = document.getElementById('sketchCanvas');
paper.setup(canvas);

ReactDOM.render(<SketchFace />, document.getElementById('controls'));

registerServiceWorker();
