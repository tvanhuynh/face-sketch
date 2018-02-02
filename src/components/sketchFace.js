import React, { Component } from 'react';
var paper = require('paper');

class SketchFace extends Component {
    state = {
        face : {
            // y-coordinates of features
            foreheadLine: .1,
            cheekLine: .4,
            jawLine: .7,
            chinLine: .90,

            // x-widths of features
            foreheadWidth: .3,
            cheekWidth: .4,
            jawWidth: .33,
            chinWidth: .1,
        },
        eyes : {
            eyeHeight: .33,
        }
    };

    constructor(props) {
        super(props);
        this.facePath = new paper.Path();
        this.facePath.strokeColor = 'black';
        this.facePath.strokeWidth = .5;
    }
    

    componentDidMount() {
        this.drawFace();
    }

    componentDidUpdate() {
        this.drawFace();
    }

    
    /**
     * Calculate the intersection of two lines on the canvas for both halves.
     * @param {number} x - percentage of whole canvas away from the center
     * @param {number} y - percentage of whole canvas away from the top
     * @return {object} the calculated points, left and right half.
     */

     calculatePoints = (x, y) => {
        const xCoordinateLeft = this.props.canvasWidth / 2 - this.props.canvasWidth * x;
        const xCoordinateRight = this.props.canvasWidth / 2 + this.props.canvasWidth * x;
        const yCoordinate = this.props.canvasWidth * y;
        return {
            left: new paper.Point(xCoordinateLeft, yCoordinate),
            right: new paper.Point(xCoordinateRight, yCoordinate),
        }
     }


     /**
      * Control change handler.
      * @param {object} event
      * @return {null}
      */
     handleChange = (event, propChange) => {
        let v = event.target.value;
        let id = event.target.id;
        this.setState(prevState => ({
            face: {
                ...prevState.face,
                [id]: v
            }
        }));
     }

    /**
     * Draw the initial shape of the face.
     * @return {null}
     */
    drawFace = () => {
        this.facePath.removeSegments();
        
        // calculate intersections
        let foreheadIntersection = this.calculatePoints(this.state.face.foreheadWidth, this.state.face.foreheadLine);
        let cheekIntersection = this.calculatePoints(this.state.face.cheekWidth, this.state.face.cheekLine);
        let jawIntersection = this.calculatePoints(this.state.face.jawWidth, this.state.face.jawLine);
        let chinIntersection = this.calculatePoints(this.state.face.chinWidth, this.state.face.chinLine);

        // draw
        this.facePath.add(foreheadIntersection.left);
        this.facePath.add(cheekIntersection.left);
        this.facePath.add(jawIntersection.left);
        this.facePath.add(chinIntersection.left);

        this.facePath.add(chinIntersection.right);
        this.facePath.add(jawIntersection.right);
        this.facePath.add(cheekIntersection.right);
        this.facePath.add(foreheadIntersection.right);

        this.facePath.smooth({ type: 'geometric' });
        // this.facePath.segments[1].handleIn = this.facePath.segments[1].handleIn.normalize(30);
        // this.facePath.segments[1].handleOut = this.facePath.segments[1].handleOut.normalize(30);

        // this.facePath.fullySelected = true;

        return null;
    }

    render() {
        return (

        <div id="face-controls">
            <div id="forehead-controls">
                <label htmlFor="foreheadLine">Forehead Height</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="foreheadLine"
                    defaultValue={this.state.face.foreheadLine}
                    onChange={this.handleChange}
                />
                <label htmlFor="foreheadWidth">Forehead Width</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="foreheadWidth"
                    defaultValue={this.state.face.foreheadWidth}
                    onChange={this.handleChange}
                />
            </div>
            <div id="cheek-controls">
                <label htmlFor="cheekLine">Cheek Height</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="cheekLine"
                    defaultValue={this.state.face.cheekLine}
                    onChange={this.handleChange}
                />
                <label htmlFor="cheekWidth">Cheek Width</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="cheekWidth"
                    defaultValue={this.state.face.cheekWidth}
                    onChange={this.handleChange}
                />
            </div>
            <div id="jaw-controls">
                <label htmlFor="jawLine">Jaw Height</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="jawLine"
                    defaultValue={this.state.face.jawLine}
                    onChange={this.handleChange}
                />
                <label htmlFor="jawWidth">Jaw Width</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="jawWidth"
                    defaultValue={this.state.face.jawWidth}
                    onChange={this.handleChange}
                />
            </div>
            <div id="chin-controls">
                <label htmlFor="chinLine">Chin Height</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="chinLine"
                    defaultValue={this.state.face.chinLine}
                    onChange={this.handleChange}
                />
                <label htmlFor="chinWidth">Chin Width</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step=".05"
                    id="chinWidth"
                    defaultValue={this.state.face.chinWidth}
                    onChange={this.handleChange}
                />
            </div>
        </div>
        
        );
    }
}

export default SketchFace;