import React, { Component } from 'react';
import noise from '../images/noise.gif';
import lines from '../images/lines.gif';
var paper = require('paper');
var controlPoint = require('./controlPoint');

class SketchFace extends Component {
    
    state = {
        selectedPoint: null,
    };
    
    
    constructor(props) {
        super(props);
        controlPoint.ref = this;
        this.drawing = new paper.Layer();
        this.texture = new paper.Layer();
        this.controls = new paper.Layer();
        this.controls.bringToFront();
        this.drawing.sendToBack();
        this.texture.blendMode = 'screen';
        this.controls.opacity = 0;
        this.ratio = paper.view.size.width / 1000;

        // draw background
        const bg = new paper.Path.Rectangle({
            point: [0, 0],
            size: [paper.view.size.width, paper.view.size.height],
        });
        bg.fillColor = '#e5e5e5';
        this.drawing.addChild(bg);
        bg.sendToBack();

        // create regions
        this.regions = {};
        this.regions.face = require('./face');
        this.regions.mouth = require('./mouth');
        this.regions.nose = require('./nose');
        this.regions.eyes = require('./eyes');
        this.regions.philtrum = require('./philtrum');
        this.regions.eyebrows = require('./eyebrows');
        this.regions.hair = require('./hair');

        // create shadows
        this.shadowLines = new paper.Group();
        this.shadowClip = new paper.CompoundPath();
        this.shadowClip.clipMask = true;
        this.shadowLines.addChild(this.shadowClip);

        const lineRaster = new paper.Raster(lines);
        lineRaster.translate(new paper.Point(paper.view.size.width/2, paper.view.size.width/2));
        lineRaster.scale(this.ratio);
        this.shadowLines.addChild(lineRaster);
        this.drawing.addChild(this.shadowLines);

        // create texture
        const noiseRaster = new paper.Raster(noise);
        noiseRaster.translate(new paper.Point(paper.view.size.width/2, paper.view.size.width/2));
        noiseRaster.scale(this.ratio);
        this.texture.addChild(noiseRaster);

        // shows highlights when user enters canvas
        paper.view.onMouseEnter = (event) => {
            this.controls.opacity = 1;
        }

        // clears the highlights when user leaves canvas
        paper.view.onMouseLeave = (event) => {
            this.controls.opacity = 0;
        }

        // deselect point when clicking a non-point on canvas
        this.texture.onClick = (event) => {
            if (this.state.selectedPoint) this.state.selectedPoint.deselect();
            this.setState({selectedPoint: null, selectedPointSide: null});
            let test = new paper.Path.Circle(new paper.Point(50, 50), 50);
            test.fillColor = 'red';
        }

        // allows user to move selected point with arrow keys
        paper.view.onKeyDown = (event) => {
            if (this.state.selectedPoint) {
                switch(event.key) {
                    case 'right':
                        this.state.selectedPoint.point(1, 0);
                        break;
                    case 'left':
                        this.state.selectedPoint.point(-1, 0);
                        break;
                    case 'up':
                        this.state.selectedPoint.point(0, -1);
                        break;
                    case 'down':
                        this.state.selectedPoint.point(0, 1);                
                        break;
                    default:
                }
            }
        }

        // resize
        window.onresize = (event) => {
            let oldSize = paper.view.viewSize.width;
            
            // resize view + bg + textures
            paper.view.viewSize.width = document.getElementById("sketchCanvas").offsetWidth;
            paper.view.viewSize.height = document.getElementById("sketchCanvas").offsetWidth;
            bg.scale(paper.view.viewSize.width / oldSize, new paper.Point(0, 0));
            this.texture.scale(paper.view.viewSize.width / oldSize, new paper.Point(0, 0));

            // scale drawing + controls
            Object.values(this.regions).forEach(region => {
                if(region.points) {
                    Object.values(region.points).forEach(point => {
                        point.resize(oldSize);
                    })
                }
            });
            Object.values(this.regions).forEach(region => {
                this.draw(region);
            });
        }

        // delete after
        paper.view.onClick = (event) => {
            console.log("x: " + (paper.view.size.width / 2 - event.point.x)/paper.view.size.width + " & y: " + event.point.y/paper.view.size.width);
        }
    }


    componentDidMount() {
        Object.values(this.regions).forEach(region => {
            this.draw(region)
        });
    }


    /**
     * Draw parts of the face onto the canvas.
     * @param {string} region - facial region to redraw
     * @return {null}
     */

    draw = (region) => {
        // clear the drawing + empty the paths database
        if (region.path) region.path.forEach(i => i.remove());
        region.path = [];
        
        // iterate through all paths
        for (let i = 0; i < region.order.length; i++) {
            let orderRef = typeof(region.order[i].order) === 'function' ? region.order[i].order() : region.order[i].order;
            // if draws only one shape
            if (region.order[i].isOneShape) {
                let reverse = orderRef.reverse().filter(i => i.point().right);
                let curves = [...orderRef.reverse().map(i => i.curve()), ...reverse.map(i => i.curve())];
                let order = [...orderRef.map(i => i.point().left), ...reverse.map(i => i.point().right)];

                if (region.order[i].isShadow) {
                    let temp = this.makePath(
                        order,
                        curves,
                        region.order[i].variation,
                        true,
                        1,
                    );

                    if (region.order[i].shadowPath) region.order[i].shadowPath.forEach(i => i.remove());
                    region.order[i].shadowPath = [...temp];
                    this.updateShadows();

                } else { // not a shadow
                    let temp = this.makePath(
                        order,
                        curves,
                        region.order[i].variation,
                        region.order[i].isClosed,
                        region.order[i].iterations,
                    );
    
                    // add to paths database
                    region.path.push(...temp);
                }

            } else { // draws two separate shapes
                let curves = orderRef.map(i => i.curve());
                let orderLeft = orderRef.map(i => i.point().left);
                let orderRight = orderRef.map(i => i.point().right);

                if (region.order[i].isShadow) {
                    let tempLeft = this.makePath(
                        orderLeft,
                        curves,
                        region.order[i].variation,
                        true,
                        1,
                    );
        
                    let tempRight = this.makePath(
                        orderRight,
                        curves,
                        region.order[i].variation,
                        true,
                        1,
                    );

                    if (region.order[i].shadowPath) region.order[i].shadowPath.forEach(i => i.remove());
                    region.order[i].shadowPath = [...tempLeft, ...tempRight];
                    this.updateShadows();

                } else {
                    let tempLeft = this.makePath(
                        orderLeft,
                        curves,
                        region.order[i].variation,
                        region.order[i].isClosed,
                        region.order[i].iterations,
                    );
        
                    let tempRight = this.makePath(
                        orderRight,
                        curves,
                        region.order[i].variation,
                        region.order[i].isClosed,
                        region.order[i].iterations,
                    );

                    // add to paths database
                    region.path.push(...tempLeft, ...tempRight);
                }
            }
        }
    }

    /**
     * Makes the path object
     * @param {array} order - order of points to add
     * @param {array} curves - curves in relation the the points
     * @param {number} variation - variation that the points should go under
     * @param {boolean} closed - whether or not the path should be closed
     * @param {number} iterations - total iterations
     * @returns {array} list of paths created
     */

     makePath(order, curves, variation, closed, iterations){
         let paths = [];

        for (let i = 0; i < iterations; i++) {
            let temp = new paper.Path();
            temp.closed = closed;
            temp.strokeColor = 'black';
            temp.strokeWidth = this.ratio * (i + 1) / iterations;
    
            // draw left + right side
            order.forEach(i => {
                const randSignX = Math.random() < .5 ? 1 : -1;
                const randSignY = Math.random() < .5 ? 1 : -1;
                temp.add(i.add(new paper.Point(Math.random() * variation * this.ratio * randSignX, Math.random() * variation * this.ratio * randSignY)))
            });
            
            // adjust curves left + right side;
            if (temp.segments.length) temp.smooth({type: 'geometric'});
            for (let i = 0; i < curves.length; i++) {
                temp.segments[i].handleIn = temp.segments[i].handleIn.multiply(curves[i]);
                temp.segments[i].handleOut = temp.segments[i].handleOut.multiply(curves[i]);
            }

            paths.push(temp);
        }

        paths.forEach(i => this.drawing.addChild(i));

        return paths;
     }

     /**
      * Update the shadow clipping mask
      */
      updateShadows = () => {
        this.shadowClip.removeChildren();

        Object.values(this.regions).forEach(region => {
            region.order.filter(i => i.shadowPath !== undefined).forEach(i => i.shadowPath.forEach(j => this.shadowClip.addChild(j)));
        });
      }


     /**
      * Control curve change.
      * @param {object} event
      * @return {null}
      */
     handleCurveChange = (event) => {
        let v = event.target.value;
        this.state.selectedPoint.curve(v);
        this.setState({selectedPoint: this.state.selectedPoint});
     }


    render() {
        if (!this.state.selectedPoint) {
            return ('this is null');
        } else {
            return (
                <div id="controls">
                    <label htmlFor='selected-point'>Curvature</label>
                    <input
                    type='range'
                    step='.005'
                    min='0'
                    max='1'
                    id='selected-point'
                    value={this.state.selectedPoint.curve()}
                    onChange={this.handleCurveChange}
                    />
                </div>
            )
        }
    }
}

export default SketchFace;