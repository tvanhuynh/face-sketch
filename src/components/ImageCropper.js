import React, { Component } from 'react';
var paper = require('paper');

class ImageCropper extends Component {
    
    state = {
        selected: false,
        src: '',
        scale: 1,
        rotate: 0,
        opacity: 1,
        visibility: true,
    };

    constructor(props) {
        super(props);
        this.props.SketchFace.image = new paper.Raster();
        this.props.SketchFace.reference.addChild(this.props.SketchFace.image);
        this.props.SketchFace.image.source = '';

        this.imageScaleRef = 1;
        this.imageRotateRef = 0

        this.props.SketchFace.image.translate(new paper.Point(paper.view.viewSize.width/2, paper.view.viewSize.width/2));
    }

    componentDidUpdate() {
        if (this.state.src !== '') {
            if (this.state.visibility) {
                this.props.SketchFace.texture.visible = false;
                this.props.SketchFace.image.source = this.state.src;
            } else {
                this.props.SketchFace.texture.visible = true;
                this.props.SketchFace.image.source = '';
            }

        } else {
            this.props.SketchFace.texture.visible = true;
            this.props.SketchFace.image.source = '';
        }
        if (this.state.selected) {
            this.props.SketchFace.controls.visible = false;
            this.props.SketchFace.image.onMouseDrag = event => {
                this.props.SketchFace.image.translate(event.delta);
            }
        }
    }

    handleCanvasChange = event => {
    const v = event.target.value;
    const id = event.target.id;
    let temp;
    switch(id) {
        case "image-source":
        this.setState({src: v});
        break;
        case "image-size":
        temp = (v.length !== 0 || v !== 0 ) ? v / this.imageScaleRef : 1;
        this.props.SketchFace.image.scale(temp);
        if (v.length !== 0 || v !== 0) {this.imageScaleRef = v}
        this.setState({scale: v});
        break;
        case "image-rotate":
        temp = v - this.imageRotateRef;
        this.props.SketchFace.image.rotate(temp);
        this.imageRotateRef = v;
        this.setState({rotate: v});
        break;
        case "image-opacity":
        this.props.SketchFace.image.opacity = v;
        this.setState({opacity: v});
        break;
        default:
        break;
    }

    paper.view.draw();
    }

    /**
     * Close out of the reference image editor.
     */
    close = () => {
        this.props.SketchFace.controls.visible = true;
        this.props.SketchFace.image.onMouseDrag = null;
        this.setState({selected: false});
    }

    /** 
     * Remove reference image
     */

    remove = () => {
        this.setState({src: ''});
    }
    
    render() {
        if (!this.state.selected && this.state.src === '') {
            return (
                <div id="image-cropper-controls">
                    <button onClick={() => this.setState({selected: true})}>Add Reference Image</button>
                </div>
            )
        } else if (!this.state.selected) {
            return (
                <div id="image-cropper-controls">
                    <button onClick={() => this.setState({selected: true})}>Edit Reference Image</button>
                    <button onClick={() => this.setState({visibility: this.state.visibility ? false : true})}>Toggle Visibility</button>
                </div>
            )
        } else {
            return (
                <div id="image-cropper-controls">
                    <div className="control__box">
                        <label htmlFor="image-source">Image URL</label>
                        <input type="text" id="image-source" value={this.state.src} onChange={this.handleCanvasChange}/>
                    </div>
                    
                    <div className="control__box">
                        <label htmlFor="image-size">Size</label>
                        <input type="range" id="image-size" value={this.state.scale} min=".01" step=".05" max="3" onChange={this.handleCanvasChange}/>
                    </div>

                    <div className="control__box">
                        <label htmlFor="image-rotate">Rotate</label>
                        <input type="range" id="image-rotate" value={this.state.rotate} step="0.05" min="0" max="360" onChange={this.handleCanvasChange}/>
                    </div>

                    <div className="control__box">
                        <label htmlFor="image-opacity">Opacity</label>
                        <input type="range" id="image-opacity" value={this.state.opacity} step="0.05" min="0" max="1" onChange={this.handleCanvasChange}/>
                    </div>
                    
                    <div className="control__box">
                        <button onClick={this.remove}>Remove</button>
                        <button onClick={this.close}>Done</button>
                    </div>
                </div>
            )
        }
    }
}

export default ImageCropper;