import React, { Component } from 'react';
import ImageCropper from './ImageCropper';
import noise from '../images/noise.gif';
import lines from '../images/lines.png';
var paper = require('paper');
var controlPoint = require('./controlPoint');

class SketchFace extends Component {
    
    state = {
        selectedPoint: null,
        selectedPointSide: null,
        isDragging: false,
        curl: 1,
        volume: 20,
    };
    
    
    constructor(props) {
        super(props);
        controlPoint.ref = this;
        this.drawing = new paper.Layer();
        this.texture = new paper.Layer();
        this.controls = new paper.Layer();
        this.reference = new paper.Layer();
        this.controls.bringToFront();
        this.drawing.sendToBack();
        this.reference.sendToBack();
        this.controls.opacity = 0;
        this.ratio = paper.view.size.width / 1000;
        this.image = '';

        // draw background
        const bg = new paper.Path.Rectangle({
            point: [0, 0],
            size: [paper.view.size.width, paper.view.size.height],
        });
        bg.fillColor = '#ffffff';
        this.reference.addChild(bg);

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

        this.lineRaster = new paper.Raster(lines);
        this.lineRaster.translate(new paper.Point(paper.view.size.width/2, paper.view.size.width/2));
        this.lineRaster.scale(this.ratio);
        this.shadowLines.addChild(this.lineRaster);
        this.drawing.addChild(this.shadowLines);

        // create texture
        const noiseRaster = new paper.Raster(noise);
        noiseRaster.translate(new paper.Point(paper.view.size.width/2, paper.view.size.width/2));
        noiseRaster.scale(this.ratio);
        noiseRaster.blendMode = 'screen';
        this.texture.addChild(noiseRaster);

        // shows highlights when user enters canvas
        this.controls.opacity = 1;
        paper.view.onMouseEnter = (event) => {
            this.controls.opacity = 1;
        }

        // clears the highlights when user leaves canvas
        paper.view.onMouseLeave = (event) => {
            if (this.state.isDragging) {
                this.controls.opacity = 1;
            } else {
                this.controls.opacity = 0;
            }
        }

        // deselect point when clicking a non-point on canvas
        this.texture.onClick = (event) => {
            if (this.state.selectedPoint) this.state.selectedPoint.deselect();
            this.setState({selectedPoint: null, selectedPointSide: null});
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
            this.lineRaster.scale(paper.view.viewSize.width / oldSize, new paper.Point(0, 0));

            // scale drawing + controls
            for (let region in this.regions) {
                if(this.regions[region].points) {
                    for (let point in this.regions[region].points) {
                        this.regions[region].points[point].resize(oldSize);
                    }
                }
            }
            for (let region in this.regions) {
                this.draw(this.regions[region])
            }
        }

        // delete after
        // paper.view.onClick = (event) => {
        //     console.log("x: " + (paper.view.size.width / 2 - event.point.x)/paper.view.size.width + " & y: " + event.point.y/paper.view.size.width);
        // }

        window.oncontextmenu = () => {
            this.controls.opacity = 0;
            // return false;
        }
    }


    componentDidMount() {
        for(let region in this.regions) {
            this.draw(this.regions[region])
        }
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

                if (region === this.regions.hair) { // is hair
                    let temp = this.makeHairPath(
                        order,
                        region.order[i].variation,
                        region.order[i].iterations,
                        region.order[i].curl,
                        region.order[i].volume,
                    );
    
                    // add to paths database
                    region.path.push(...temp);

                } else if (region.order[i].isShadow) { // is a shadow
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
     * Make hair path
    * @param {array} order - order of points to add
    * @param {number} variation - variation that the points should go under
    * @param {number} iterations - total iterations
    * @param {number} curl - amount of curlage in the strand of hair
    * @param {number} volume - the amount of volume in the strand of hair
    * @returns {array} list of paths created
    */
     makeHairPath(order, variation, iterations, curl, volume) {
        let paths = [];

        for (let i = 0; i < iterations; i++) {
            let temp = new paper.Path();

            order.forEach(i => {
                const randSignX = Math.random() < .5 ? 1 : -1;
                const randSignY = Math.random() < .5 ? 1 : -1;
                temp.add(i.add(new paper.Point(Math.random() * variation * this.ratio * randSignX, Math.random() * variation * this.ratio * randSignY)))
            })

            if (temp.segments.length) temp.smooth({type: 'geometric'});

            if (curl > 1) {
                let final = new paper.Path();
                final.strokeColor = 'black';
                final.strokeWidth = this.ratio * (i + 1) / iterations;
                final.add(temp.segments[0]); // add first point

                // add curls + volume
                for (let j = 1; j <= curl; j++) {
                    let randVariation = Math.random() < .5 ? 1 : -1;
                    randVariation *= Math.random() * variation;
                    let offset = (temp.length / (parseInt(curl, 10) + 1)) * j + randVariation;
                    let normal = temp.getNormalAt(offset) ? temp.getNormalAt(offset).multiply(volume) : 0;
                    let point = temp.getPointAt(offset);
                    
                    if (point) {
                        if (j % 2 === 0) {
                            final.add(point.add(normal));
                        } else {
                            final.add(point.subtract(normal));
                        }
                    }
                }
    
                final.add(temp.segments[temp.segments.length - 1]); // add last point

                if (final.segments.length) final.smooth({type: 'geometric'});
                temp.remove();
                paths.push(final);
            } else {
                temp.strokeColor = 'black';
                temp.strokeWidth = this.ratio * (i + 1) / iterations;
                paths.push(temp);
            }
        }

        paths.forEach(i => this.drawing.addChild(i));
        
        return paths;
     }
    


     /**
      * Update the shadow clipping mask
      * @return {null}
      */
      updateShadows = () => {
        this.shadowClip.removeChildren();

        for (let region in this.regions) {
            this.regions[region].order.filter(i => i.shadowPath !== undefined).forEach(i => i.shadowPath.forEach(j => this.shadowClip.addChild(j)));            
        }
      }


     /**
      * Control curve change.
      * @param {object} event
      * @return {null}
      */
     handleCurveChange = (event) => {
        this.controls.opacity = 0;
        let v = event.target.value;
        this.state.selectedPoint.curve(v);
        this.setState({selectedPoint: this.state.selectedPoint});
     }


     /**
      * Control hair change.
      * @param {object} event
      * @return {null}
      */
     handleHairChange = (event = null) => {
        this.controls.opacity = 0;
        let i = this.regions.hair.getOrderParentIndex(this.state.selectedPoint);
        if (!this.regions.hair.order[i]) return;
        if (event.target.id === "hair-volume") {
            this.regions.hair.order[i].volume = event.target.value;
            this.setState({volume: event.target.value});
        } else if (event.target.id === 'hair-curl') {
            this.regions.hair.order[i].curl = event.target.value;
            this.setState({curl: event.target.value});
        }
        this.draw(this.regions.hair);
     }


     /**
      * Add another hair line
      * @return {null}
      */
    addHair = () => {
        this.regions.hair.addNew();
        this.draw(this.regions.hair);
    }


    /**
     * Remove the selected hair
     * @return {null}
     */
    removeHair = () => {
        let i = this.regions.hair.getOrderParentIndex(this.state.selectedPoint);
        let strands = this.regions.hair.order;
        strands[i].order.forEach(k => {
            k.destroy();
        })
        strands.splice(i, 1)
        this.regions.hair.order = strands;
        this.draw(this.regions.hair);
    }


    /**
     * Determine Controls
     * @return {object} controls to display at bottom of page
     */
    makeControls = () => {
        if (!this.state.selectedPoint) {
            if (this.regions.hair.order.length === 0) {
                return (
                    <div>
                        <div className="control__box">
                            <button onClick={this.addHair}>Add Hair</button>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="control__box">
                        Select a point to change its sharpness.
                    </div>
                );
            }
        } else if (!this.isHair) {
            return (
                <div>
                    <div className="control__box">
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
                </div>
            )
        } else {
            return (
                <div>
                    <div className="control__box">
                        <label htmlFor='hair-curl'>Hair Curl</label>
                        <input
                        type='range'
                        step='1'
                        min='1'
                        max='50'
                        id='hair-curl'
                        value={this.state.curl}
                        onChange={this.handleHairChange}
                        />
                    </div>
                    <div className="control__box">
                        <label htmlFor='hair-volume'>Hair Volume</label>
                        <input
                        type='range'
                        step='1'
                        min='0'
                        max='50'
                        id='hair-volume'
                        value={this.state.volume}
                        onChange={this.handleHairChange}
                        />
                    </div>
                    <div className="control__box">
                        <button onClick={this.addHair}>Add Hair</button>
                        <button onClick={this.removeHair}>Delete Hair</button>
                    </div>
                </div>
            )
        }
    }
    
    render() {
        return (
            <div id="react-wrapper">
            
                <ImageCropper ref={input => this.imageCropper = input} SketchFace={this} />
                
                <div id="controls-wrapper">
                    {this.makeControls()}
                </div>
                
                
                <div id="copy-instructions" className="control__box">
                    * Right click &amp; save to download image.
                </div>
                
            </div>
        );
    }
}

export default SketchFace;