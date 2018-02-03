import React, { Component } from 'react';
var paper = require('paper');

class SketchFace extends Component {

    state = {
        face : {
            // y-coordinates of features
            foreheadLine: .1,
            cheekLine: .4,
            cheekConcaveLine: .5,
            jawLine: .7,
            chinLine: .90,

            // x-widths of features
            foreheadWidth: .3,
            cheekWidth: .4,
            cheekConcaveWidth: .38,
            jawWidth: .33,
            chinWidth: .1,

            // curves of features
            cheekCurve: .4,
            cheekConcaveCurve: .38,
            jawCurve: .33,
            chinCurve: .1,
        },
        eyes : {
            eyeHeight: .33,
        },
    };


    constructor(props) {
        super(props);

        this.inputProps = {
            type: 'range',
            step: .01,
            min: 0,
            onChange: this.handleChange,
        }

        this.face = {};
        this.face.path = new paper.Path();
        this.face.points = {
            forehead: {
                location: this.calculatePoints(this.state.face.foreheadWidth, this.state.face.foreheadLine),
                curve: () => {return this.state.face.foreheadCurve}
            },
            cheek: {
                location: this.calculatePoints(this.state.face.cheekWidth, this.state.face.cheekLine),
                curve: () => {return this.state.face.cheekCurve}

            },
            cheekConcave: {
                location: this.calculatePoints(this.state.face.cheekConcaveWidth, this.state.face.cheekConcaveLine),
                curve: () => {return this.state.face.cheekConcaveCurve}
            },
            jaw: {
                location: this.calculatePoints(this.state.face.jawWidth, this.state.face.jawLine),
                curve: () => {return this.state.face.jawCurve}
            },
            chin: {
                location: this.calculatePoints(this.state.face.chinWidth, this.state.face.chinLine),
                curve: () => {return this.state.face.chinCurve}
            }
        }

        this.face.order = ["forehead", "cheek", "cheekConcave", "jaw", "chin"];

        this.face.pointsOrder = () => {
            return this.face.order.map(i => this.face.points[i].location);
        }

        this.face.curveOrder = () => {
            return this.face.order.map(i => this.face.points[i].curve());
        }

        this.face.path.strokeColor = 'black';
        this.face.path.strokeWidth = .5;

    }


    componentDidMount() {
        this.drawFace();
    }


    componentDidUpdate() {
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

        switch(id) {
            case "foreheadLine":
            case "foreheadWidth":
                this.face.points.forehead.location = this.calculatePoints(this.state.face.foreheadWidth, this.state.face.foreheadLine);
                this.drawFace();
                break;
            case "cheekLine":
            case "cheekWidth":
                this.face.points.cheek.location = this.calculatePoints(this.state.face.cheekWidth, this.state.face.cheekLine);
                this.drawFace();
                break;
            case "cheekConcaveLine":
            case "cheekConcaveWidth":
                this.face.points.cheekConcave.location = this.calculatePoints(this.state.face.cheekConcaveWidth, this.state.face.cheekConcaveLine);
                this.drawFace();
                break;
            case "jawLine":
            case "jawWidth":
                this.face.points.jaw.location = this.calculatePoints(this.state.face.jawWidth, this.state.face.jawLine);
                this.drawFace();
                break;
            case "chinLine":
            case "chinWidth":
                this.face.points.chin.location = this.calculatePoints(this.state.face.chinWidth, this.state.face.chinLine);
                this.drawFace();
                break;
            case "foreheadCurve":
            case "cheekCurve":
            case "cheekConcaveCurve":
            case "jawCurve":
            case "chinCurve":
                this.drawFace();
                break;
            default:
                // console.log('error');
        }
     }

     
    /**
     * Draw the shape of the face.
     * @return {null}
     */
    drawFace = () => {
        this.face.path.removeSegments();

        let temp = this.face.pointsOrder();

        // draw left side of face
        temp.forEach(element => {
            this.face.path.add(element.left);
        });

        // draw right side of face
        temp.reverse().forEach(element => {
            this.face.path.add(element.right);
        });

        // add curves
        this.face.path.smooth({ type: 'geometric' });
        temp = this.face.curveOrder().concat(this.face.curveOrder().reverse());
        for (let i = 0; i < this.face.path.segments.length; i++) {
            this.face.path.segments[i].handleIn = this.face.path.segments[i].handleIn.multiply(temp[i]);
            this.face.path.segments[i].handleOut = this.face.path.segments[i].handleOut.multiply(temp[i]);
        }

        this.face.path.fullySelected = true;

        return null;
    }


     /**
      * Create control for face settings
      * @param {string} label - What the label of the control should read.
      * @param {string} stateSetting - Name of the state setting this control is associated with.
      * @param {number} max - Max number setting for the control
      * @return {JSX} The rendered controls for setting
      */
      
     makeControl = (label, stateSetting, max = 1) => {
         return (
            <div id={stateSetting + '-control'} className="control">
            <label htmlFor={stateSetting}>{label}</label>
            <input
                type='range'
                step=".01"
                min="0"
                max={max}
                onChange={this.handleChange}
                id={stateSetting}
                defaultValue={this.state.face[stateSetting]}
            />
            </div>
         )
     }


    render() {
        return (
        <div id="face-controls">

            <div id="forehead-controls">
                {this.makeControl('Forehead Position', 'foreheadLine')}
                {this.makeControl('Forehead Width', 'foreheadWidth')}
                {this.makeControl('Forehead Curve', 'foreheadCurve')}
            </div>
            
            <div id="cheek-controls">
                {this.makeControl('Cheek Position', 'cheekLine')}
                {this.makeControl('Cheek Width', 'cheekWidth')}
                {this.makeControl('Cheek Curve', 'cheekCurve')}
                {this.makeControl('Cheek Height', 'cheekConcaveLine')}
                {this.makeControl('Cheek Depth', 'cheekConcaveWidth')}
                {this.makeControl('Cheek Inner Curve', 'cheekConcaveCurve')}
            </div>
            
            <div id="jaw-controls">
                {this.makeControl('Jaw Position', 'jawLine')}
                {this.makeControl('Jaw Width', 'jawWidth')}
                {this.makeControl('Jaw Curve', 'jawCurve')}
            </div>
            
            <div id="chin-controls">
                {this.makeControl('Chin Position', 'chinLine')}
                {this.makeControl('Chin Width', 'chinWidth')}
                {this.makeControl('Chin Curve', 'chinCurve')}
            </div>

        </div>
        
        );
    }
}

export default SketchFace;