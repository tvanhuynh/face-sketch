import React, { Component } from 'react';
var paper = require('paper');

class SketchFace extends Component {

    state = {
        face : {
            // y-coordinates of features
            foreheadLine: .1,
            cheekLine: .4,
            backJawLine: .5,
            frontJawLine: .7,
            chinLine: .90,

            // x-widths of features
            foreheadWidth: .3,
            cheekWidth: .4,
            backJawWidth: .38,
            frontJawWidth: .33,
            chinWidth: .1,
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
        this.face.properties = {
            forehead: this.calculatePoints(this.state.face.foreheadWidth, this.state.face.foreheadLine),
            cheek: this.calculatePoints(this.state.face.cheekWidth, this.state.face.cheekLine),
            backJaw: this.calculatePoints(this.state.face.backJawWidth, this.state.face.backJawLine),
            frontJaw: this.calculatePoints(this.state.face.frontJawWidth, this.state.face.frontJawLine),
            chin: this.calculatePoints(this.state.face.chinWidth, this.state.face.chinLine)
        }

        this.face.order = () => {
            return(
                [
                    this.face.properties.forehead,
                    this.face.properties.cheek,
                    this.face.properties.backJaw,
                    this.face.properties.frontJaw,
                    this.face.properties.chin
                ]

            )
        }

        this.face.path.strokeColor = 'black';
        this.face.path.strokeWidth = .5;

    }


    componentDidMount() {
        // Draw Face
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
                this.face.properties.forehead = this.calculatePoints(this.state.face.foreheadWidth, this.state.face.foreheadLine);
                this.drawFace();
                break;
            case "cheekLine":
            case "cheekWidth":
                this.face.properties.cheek = this.calculatePoints(this.state.face.cheekWidth, this.state.face.cheekLine);
                this.drawFace();
                break;
            case "backJawLine":
            case "backJawWidth":
                this.face.properties.backJaw = this.calculatePoints(this.state.face.backJawWidth, this.state.face.backJawLine);
                this.drawFace();
                break;
            case "frontJawLine":
            case "frontJawWidth":
                this.face.properties.frontJaw = this.calculatePoints(this.state.face.frontJawWidth, this.state.face.frontJawLine);
                this.drawFace();
                break;
            case "chinLine":
            case "chinWidth":
                this.face.properties.chin = this.calculatePoints(this.state.face.chinWidth, this.state.face.chinLine);
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

        const temp = this.face.order();

        // draw left side of face
        temp.forEach(element => {
            this.face.path.add(element.left);
        });

        // draw right side of face
        temp.reverse().forEach(element => {
            this.face.path.add(element.right);
        });

        // add curves
        this.drawFaceCurves();

        this.face.path.fullySelected = true;

        return null;
    }


    /**
     * Adjust the handles of the face
     * @return {null}
     */

     drawFaceCurves = () => {
        this.face.path.smooth({ type: 'geometric' });
        // this.facePath.segments[1].handleIn = this.facePath.segments[1].handleIn.normalize(300);
        // this.facePath.segments[1].handleOut = this.facePath.segments[1].handleOut.normalize(300);

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
                {this.makeControl('Forehead Height', 'foreheadLine')}
                {this.makeControl('Forehead Width', 'foreheadWidth')}
            </div>
            
            <div id="cheek-controls">
                {this.makeControl('Cheek Height', 'cheekLine')}
                {this.makeControl('Cheek Width', 'cheekWidth')}
            </div>
            
            <div id="back-jaw-controls">
                {this.makeControl('Back Jaw Height', 'backJawLine')}
                {this.makeControl('Back Jaw Width', 'backJawWidth')}
            </div>
            
            <div id="front-jaw-controls">
                {this.makeControl('Front Jaw Height', 'frontJawLine')}
                {this.makeControl('Front Jaw Width', 'frontJawWidth')}
            </div>
            
            <div id="chin-controls">
                {this.makeControl('Chin Height', 'chinLine')}
                {this.makeControl('Chin Width', 'chinWidth')}
            </div>

        </div>
        
        );
    }
}

export default SketchFace;