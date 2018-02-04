import React, { Component } from 'react';
var paper = require('paper');

class SketchFace extends Component {

    state = {
        autoAdjust: true,
        face: {
            // y-coordinates of features
            foreheadLine: .11,
            cheekLine: .475,
            cheekConcaveLine: .595,
            jawLine: .76,
            chinLine: .935,

            // x-widths of features
            foreheadWidth: .225,
            cheekWidth: .31,
            cheekConcaveWidth: .295,
            jawWidth: .255,
            chinWidth: .08,

            // curves of features
            foreheadCurve: 1,
            cheekCurve: 1,
            cheekConcaveCurve: .435,
            jawCurve: .67,
            chinCurve: .417,
        },
        mouth: {
            // y-coordinates of features
            lipLine: .76,
            centerLipLine: .76,
            lowerLipLine: .8,
            upperLipLine: .715,
            cupidsBowLine: .725,

            // x-widths of features
            lipWidth: .12,
            lowerLipWidth: .055,
            upperLipWidth: .045,

            //ruves of features
            lipCurve: 0,
            lowerLipCurve: 1,
            upperLipCurve: .405,
            cupidsBowCurve: .425,

        },
    };


    constructor(props) {
        super(props);

        // face
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
        this.face.path.strokeColor = 'red';
        this.face.path.strokeWidth = .5;

        // mouth
        this.mouth = {};
        this.mouth.path = new paper.Path();
        this.mouth.centerpath = new paper.Path();
        this.mouth.points = {
            lowerLip: {
                location: this.calculatePoints(this.state.mouth.lowerLipWidth, this.state.mouth.lowerLipLine),
                curve: () => {return this.state.mouth.lowerLipCurve}
            },
            lip: {
                location: this.calculatePoints(this.state.mouth.lipWidth, this.state.mouth.lipLine),
                curve: () => {return this.state.mouth.lipCurve}
            },
            upperLip: {
                location: this.calculatePoints(this.state.mouth.upperLipWidth, this.state.mouth.upperLipLine),
                curve: () => {return this.state.mouth.upperLipCurve}
            },
            cupidsBow: {
                location: this.calculatePoints(0, this.state.mouth.cupidsBowLine),
                curve: () => {return this.state.mouth.cupidsBowCurve}
            }
        }
        this.mouth.path.strokeColor = 'red';
        this.mouth.path.strokeWidth = .5;
        this.mouth.centerpath.strokeColor = 'red';
        this.mouth.centerpath.strokeWidth = .5;
    }


    componentDidMount() {
        this.drawFace();
        this.drawMouth();
    }


    componentDidUpdate() {
        console.log(this.state);
    }


    /**
     * Calculate the intersection of two lines on the canvas for both halves.
     * @param {number} x - percentage (decimal value) of whole canvas away from the center
     * @param {number} y - percentage (decimal value) of whole canvas away from the top
     * @return {object} the calculated points, left and right half.
     */

     calculatePoints = (x, y) => {
        let canvasWidth = paper.view.size.width;

        if (isNaN(x*1) || isNaN(y*1) || typeof(x) === "boolean" || typeof(y) === "boolean") {
            throw TypeError;
        } else if (x < 0 || y < 0 || x > 1 || y > 1) {
            throw RangeError;
        } else if (typeof(paper.view.size.width) !== "number" || paper.view.size.width <= 0) {
            throw Error("Invalid canvas size.");
        }

        const xCoordinateLeft = canvasWidth / 2 - canvasWidth * x;
        const xCoordinateRight = canvasWidth / 2 + canvasWidth * x;
        const yCoordinate = canvasWidth * y;
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
        let group = event.target.dataset.group;
        this.setState(prevState => ({
            [group]: {
                ...prevState[group],
                [id]: v
            }
        }));

        switch(id) {
            // face
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
            // mouth
            case "lipLine":
            case "lipWidth":
                this.mouth.points.lip.location = this.calculatePoints(this.state.mouth.lipWidth, this.state.mouth.lipLine);
                this.drawMouth();
                break;
            case "lowerLipLine":
            case "lowerLipWidth":
               this.mouth.points.lowerLip.location = this.calculatePoints(this.state.mouth.lowerLipWidth, this.state.mouth.lowerLipLine);
               this.drawMouth();
               break;
            case "upperLipLine":
            case "upperLipWidth":
               this.mouth.points.upperLip.location = this.calculatePoints(this.state.mouth.upperLipWidth, this.state.mouth.upperLipLine);
               this.drawMouth();
               break;
            case "cupidsBowLine":
                this.mouth.points.cupidsBow.location = this.calculatePoints(0, this.state.mouth.cupidsBowLine);
                this.drawMouth();
                break;
            case "lowerLipCurve":
            case "upperLipCurve":
            case "cupidsBowCurve":
            case "centerLipLine":
                this.drawMouth();
                break; 
            default:
                // console.log('error');
        }
     }


    /**
     * Draw symmetrical
     * @param {paper.Path} path
     * @param {array} points
     * @param {array} curves
     * @param {boolean} isClosed
     * @returns {null}
     */

    drawSymmetric = (path, points, curves, isClosed = true) => {
        path.removeSegments();
        isClosed = typeof(isClosed) === "boolean" ? isClosed : true

        // add points
        points.forEach(element => {
            const temp = element.left ? element.left : function() {throw TypeError};
            path.add(temp);
        });

        points.reverse().forEach(element => {
            const temp = element.right ? element.right : function() {throw TypeError};
            path.add(temp);
        });

        // close path or leave open
        path.closed = isClosed;

        // adjust curves
        path.smooth({type:'geometric'});
        let max = points.length;

        for (let i = 0; i < max; i++) {
            path.segments[i].handleIn = path.segments[i].handleIn.multiply(curves[i] ? curves[i] : function() {throw TypeError});
            path.segments[i].handleOut = path.segments[i].handleOut.multiply(curves[i] ? curves[i] : function() {throw TypeError});
        }

        curves.reverse();

        for (let i = 0; i < max; i++) {
            path.segments[max + i].handleIn = path.segments[max + i].handleIn.multiply(curves[i] ? curves[i] : function() {throw TypeError});
            path.segments[max + i].handleOut = path.segments[max + i].handleOut.multiply(curves[i] ? curves[i] : function() {throw TypeError});
        }

        return null;
    }

     
    /**
     * Draw the shape of the face.
     * @return {null}
     */
    drawFace = () => {
        const order = ["forehead", "cheek", "cheekConcave", "jaw", "chin"];
        this.drawSymmetric (
            this.face.path,
            order.map(i => this.face.points[i].location),
            order.map(i => this.face.points[i].curve()),
        )
        return null;
    }

     
    /**
     * Draw the shape of the lips.
     * @return {null}
     */
    drawMouth = () => {
        const order = ["upperLip", "lip", "lowerLip"];
        this.drawSymmetric (
            this.mouth.path,
            order.map(i => this.mouth.points[i].location),
            order.map(i => this.mouth.points[i].curve()),
        )
        this.mouth.path.add(this.mouth.points.cupidsBow.location.left);
        this.mouth.path.lastSegment.handleIn = new paper.Point(this.state.mouth.upperLipWidth * paper.view.size.width * this.state.mouth.cupidsBowCurve * .5, 0);
        this.mouth.path.lastSegment.handleOut = new paper.Point(this.state.mouth.upperLipWidth * paper.view.size.width * this.state.mouth.cupidsBowCurve * -.5, 0);

        this.mouth.centerpath.removeSegments();
        this.mouth.centerpath.add(this.mouth.points.lip.location.left);
        this.mouth.centerpath.add(new paper.Point(paper.view.size.width/2, this.state.mouth.centerLipLine * paper.view.size.width));
        this.mouth.centerpath.add(this.mouth.points.lip.location.right);
        this.mouth.centerpath.smooth({type:'geometric'});        
        return null;
    }


     /**
      * Create control for face settings
      * @param {string} label - What the label of the control should read.
      * @param {string} stateSetting - Name of the state setting this control is associated with.
      * @param {string} stateGroup - Name of the state group this control is associated with.
      * @param {number} max - Max number setting for the control
      * @return {JSX} The rendered controls for setting
      */
      
     makeControl = (label, stateSetting, stateGroup, max = 1) => {
        max = typeof(max) === "number" ? max : 1;
        if (typeof(label) !== "string" || typeof(stateSetting) !== "string") {
            throw TypeError;
        }

         return (
            <div id={stateSetting + '-control'} className="control">
                <label htmlFor={stateSetting}>{label}</label>
                <input
                    type='range'
                    step=".005"
                    min="0"
                    max={max}
                    onChange={this.handleChange}
                    id={stateSetting}
                    defaultValue={this.state[stateGroup][stateSetting]}
                    data-group={stateGroup}
                />
            </div>
         )
     }


    render() {
        return ( <div id="controls">
            <div id="face-controls">
                <div id="forehead-controls">
                    {this.makeControl('Forehead Position', 'foreheadLine', 'face')}
                    {this.makeControl('Forehead Width', 'foreheadWidth', 'face')}
                    {this.makeControl('Forehead Curve', 'foreheadCurve', 'face')}
                </div>
                <div id="cheek-controls">
                    {this.makeControl('Cheek Position', 'cheekLine', 'face')}
                    {this.makeControl('Cheek Width', 'cheekWidth', 'face')}
                    {this.makeControl('Cheek Curve', 'cheekCurve', 'face')}
                    {this.makeControl('Cheek Height', 'cheekConcaveLine', 'face')}
                    {this.makeControl('Cheek Depth', 'cheekConcaveWidth', 'face')}
                    {this.makeControl('Cheek Inner Curve', 'cheekConcaveCurve', 'face')}
                </div>
                <div id="jaw-controls">
                    {this.makeControl('Jaw Position', 'jawLine', 'face')}
                    {this.makeControl('Jaw Width', 'jawWidth', 'face')}
                    {this.makeControl('Jaw Curve', 'jawCurve', 'face')}
                </div>
                <div id="chin-controls">
                    {this.makeControl('Chin Position', 'chinLine', 'face')}
                    {this.makeControl('Chin Width', 'chinWidth', 'face')}
                    {this.makeControl('Chin Curve', 'chinCurve', 'face')}
                </div>
            </div>
            <div id="mouth-controls">
                <div id="lip-controls">
                    {this.makeControl('Lip Corner Position', 'lipLine', 'mouth')}
                    {this.makeControl('Lip Center Position', 'centerLipLine', 'mouth')}
                    {this.makeControl('Lip Width', 'lipWidth', 'mouth')}
                </div>
                <div id="lowerLip-controls">
                    {this.makeControl('Lower Lip Position', 'lowerLipLine', 'mouth')}
                    {this.makeControl('Lower Lip Width', 'lowerLipWidth', 'mouth')}
                    {this.makeControl('Lower Lip Curve', 'lowerLipCurve', 'mouth')}
                </div>
                <div id="upperLip-controls">
                    {this.makeControl('Upper Lip Position', 'upperLipLine', 'mouth')}
                    {this.makeControl('Upper Lip Width', 'upperLipWidth', 'mouth')}
                    {this.makeControl('Upper Lip Curve', 'upperLipCurve', 'mouth')}
                </div>
                <div id="cupidsBow-controls">
                    {this.makeControl('Cupid\'s Bow Position', 'cupidsBowLine', 'mouth')}
                    {this.makeControl('Cupid\'s Bow Curve', 'cupidsBowCurve', 'mouth')}
                </div>
            </div>
        
        </div>);
    }
}

export default SketchFace;