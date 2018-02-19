import React, { Component } from 'react';
var paper = require('paper');
var controlPoint = require('./controlPoint');

class SketchFace extends Component {
    
    state = {
        autoAdjust: true,
        selectedPoint: null,
    };
    
    
    constructor(props) {
        super(props);
        controlPoint.ref = this;
        
        this.regions = {};
        this.regions.face = require('./face');
        this.regions.mouth = require('./mouth');
        this.regions.nose = require('./nose');
        this.regions.eyes = require('./eyes');

        paper.view.onMouseEnter = (event) => {
            Object.values(this.regions).forEach(region => {
                Object.values(region.points).forEach(point => {
                    point.showHighlight();
                });
            });
            if (this.state.selectedPoint) {
                this.state.selectedPoint.highlight();            
            }
        }

        paper.view.onMouseLeave = (event) => {
            Object.values(this.regions).forEach(region => {
                Object.values(region.points).forEach(point => {
                    point.clearHighlight();
                });
            });
        }

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

        paper.view.onClick = (event) => {
            console.log("x: " + (paper.view.size.width / 2 - event.point.x)/paper.view.size.width + " & y: " + event.point.y/paper.view.size.width);
        }
    }


    componentDidMount() {
        Object.values(this.regions).forEach(region => {
            this.draw(region)
        });

        var rect = new paper.Path.Rectangle({
            point: [0, 0],
            size: [paper.view.size.width, paper.view.size.height],
        });
        rect.sendToBack();
        rect.fillColor = '#e5e5e5';
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
        
        // if draws only one shape
        for (let i = 0; i < region.order.length; i++) {
            let orderRef = typeof(region.order[i].order) === 'function' ? region.order[i].order() : region.order[i].order;

            if (region.order[i].isOneShape) {
                let reverse = orderRef.reverse().filter(i => i.point().right);
                let curves = [...orderRef.reverse().map(i => i.curve()), ...reverse.map(i => i.curve())];
                let order = [...orderRef.map(i => i.point().left), ...reverse.map(i => i.point().right)];

                let temp = this.makePath(
                    order,
                    curves,
                    region.order[i].variation,
                    region.order[i].isClosed,
                    region.order[i].iterations,
                );
    
                // add to paths database
                region.path.push(...temp);
            } else { // draws two separate shapes
                let curves = orderRef.map(i => i.curve());
                let orderLeft = orderRef.map(i => i.point().left);
                let orderRight = orderRef.map(i => i.point().right);
    
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
            temp.strokeWidth = .6 * (i + 1) / iterations;
    
            // draw left + right side
            order.forEach(i => {
                const randSignX = Math.random() < .5 ? 1 : -1;
                const randSignY = Math.random() < .5 ? 1 : -1;
                temp.add(i.add(new paper.Point(Math.random() * variation * randSignX, Math.random() * variation * randSignY)))
            });
            
            // adjust curves left + right side;
            if (temp.segments.length) temp.smooth({type: 'geometric'});
            for (let i = 0; i < curves.length; i++) {
                temp.segments[i].handleIn = temp.segments[i].handleIn.multiply(curves[i]);
                temp.segments[i].handleOut = temp.segments[i].handleOut.multiply(curves[i]);
            }

            paths.push(temp);
        }

        return paths;
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