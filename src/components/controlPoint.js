var paper = require('paper');

/**
    * Create new controlPoint object to manipulate points.
    * @param {object} region - reference point to SketchFace component
    * @param {number} x - percentage (decimal value) of whole canvas away from the center
    * @param {number} y - percentage (decimal value) of whole canvas away from the top
    * @param {number} curve - percentage (decimal value) of geometric smoothing handlebars
    * @param {boolean} isSymmetric - whether or not the point has an associated symmetrical point
    * @param {boolean} xLock - whether or not the point is locked on the x-axis
    * @return {object} functions that will let you interact with specific controlpoint
    */

exports.createPoint = (function (region, x, y, curve = 0, isSymmetric = true, xLock = false) {
    var ref = exports.ref;
    let highlightOpacity = 0;
    this.curve = curve;
    this.point = module.exports.calculatePoints(x,y);

    if (isSymmetric) {
        this.selector = {
            left: new paper.Path.Circle(this.point.left, 8),
            right: new paper.Path.Circle(this.point.right, 8),
        };
        this.selector.right.fillColor = 'yellow';
        this.selector.right.opacity = highlightOpacity;

        this.selector.right.onMouseEnter = (event) => {
            this.selector.right.opacity = .5;
        }

        this.selector.right.onMouseLeave = (event) => {
            this.selector.right.opacity = highlightOpacity;
        }

        this.selector.right.onMouseDrag = (event) => {
            if (xLock) {event.delta.x = 0}
            this.selector.right.opacity = .5;
            this.point.right = this.point.right.add(event.delta);
            this.selector.right.position = this.selector.right.position.add(event.delta);
            this.point.left = this.point.left.subtract(event.delta.multiply(new paper.Point(1, -1)));
            this.selector.left.position = this.selector.left.position.subtract(event.delta.multiply(new paper.Point(1, -1)));
            ref.setState({selectedPoint: this.returnFunctions, selectedPointSide: 'right'});
            region.redraw.forEach(i => ref.draw(i));
        }

        this.selector.right.onClick = (event) => {
            ref.setState({selectedPoint: this.returnFunctions, selectedPointSide: 'right'});
        }

    } else {
        this.point.right = null;
        this.selector = {
            left: new paper.Path.Circle(this.point.left, 8),
        }
    }
    
    this.selector.left.fillColor = 'yellow';
    this.selector.left.opacity = highlightOpacity;

    this.selector.left.onMouseEnter = (event) => {
        this.selector.left.opacity = .75;
    }
    
    this.selector.left.onMouseLeave = (event) => {
        this.selector.left.opacity = highlightOpacity;
    }
    
    this.selector.left.onMouseDrag = (event) => {
        if (xLock) {event.delta.x = 0}
        this.selector.left.opacity = .75;
        this.point.left = this.point.left.add(event.delta);
        this.selector.left.position = this.selector.left.position.add(event.delta);
        if (isSymmetric) {
            this.point.right = this.point.right.subtract(event.delta.multiply(new paper.Point(1, -1)));
            this.selector.right.position = this.selector.right.position.subtract(event.delta.multiply(new paper.Point(1, -1)));
        }
        
        ref.setState({selectedPoint: this.returnFunctions, selectedPointSide: 'left'});
        region.redraw.forEach(i => ref.draw(i));
    }

    this.selector.left.onClick = (event) => {
        ref.setState({selectedPoint: this.returnFunctions, selectedPointSide: 'left'});
    }

    this.returnFunctions = {
        point: (x = null, y = null) => {
            if (x != null || y != null) {
                if (xLock) {x = 0}
                if (ref.state.selectedPointSide === 'left') {
                    this.point.left = this.point.left.add(new paper.Point(x, y));
                    this.selector.left.position = this.selector.left.position.add(new paper.Point(x, y));
                    if (isSymmetric) {
                        this.point.right = this.point.right.add(new paper.Point(x, y).multiply(-1, 1));
                        this.selector.right.position = this.selector.right.position.add(new paper.Point(x, y).multiply(-1, 1));
                    }
                } else {
                    this.point.right = this.point.right.add(new paper.Point(x, y));
                    this.point.left = this.point.left.add(new paper.Point(x, y).multiply(-1, 1));
                    this.selector.right.position = this.selector.right.position.add(new paper.Point(x, y));
                    this.selector.left.position = this.selector.left.position.add(new paper.Point(x, y).multiply(-1, 1));
                }
                region.redraw.forEach(i => ref.draw(i));
            }
            return this.point
        },
        curve: (v = null) => {
            if (v) {
                this.curve = v;
                region.redraw.forEach(i => ref.draw(i));
            }
            return this.curve;
        },
        highlight: () => {
            highlightOpacity = .75;
            this.selector.left.opacity = .75;
            if (isSymmetric) {
                this.selector.right.opacity = .75;
            }
            return null;
        },
        showHighlight: () => {
            highlightOpacity = .25;
            this.selector.left.opacity = .25;
            if (isSymmetric) {
                this.selector.right.opacity = .25;
            }
            return null;
        },
        clearHighlight: () => {
            highlightOpacity = 0;
            this.selector.left.opacity = 0;
            if (isSymmetric) {
                this.selector.right.opacity = 0;
            }
            return null;
        }
    }

    return this.returnFunctions;
});

/**
* Calculate the intersection of two lines on the canvas for both halves.
* @param {number} x - percentage (decimal value) of whole canvas away from the center
* @param {number} y - percentage (decimal value) of whole canvas away from the top
* @return {object} the calculated points, left and right half.
*/

exports.calculatePoints = (x, y) => {
   let canvasWidth = paper.view.size.width;

//    if (isNaN(x*1) || isNaN(y*1) || typeof(x) === "boolean" || typeof(y) === "boolean") {
//        throw TypeError;
//    } else if (x < 0 || y < 0 || x > 1 || y > 1) {
//        throw RangeError;
//    } else if (typeof(paper.view.size.width) !== "number" || paper.view.size.width <= 0) {
//        throw Error("Invalid canvas size.");
//    }

   const xCoordinateLeft = canvasWidth / 2 - canvasWidth * x;
   const xCoordinateRight = canvasWidth / 2 + canvasWidth * x;
   const yCoordinate = canvasWidth * y;
   return {
       left: new paper.Point(xCoordinateLeft, yCoordinate),
       right: new paper.Point(xCoordinateRight, yCoordinate),
   }
}

/**
 * Create a new set of points from leftPoint
 * @param {object} leftPoint - left point to be mirrored
 * @param {number} curve - curve to be associated with this point
 * @return {object} right point
 */

exports.createMirrorPoints = (point, curve) => {
    let canvasWidth = paper.view.size.width;
    let rightX = canvasWidth / 2 + (canvasWidth / 2 - point.x);
    return {
        point: () => {
            return {left: point, right: new paper.Point(rightX, point.y)}
        },
        curve: () => curve
    }
}

/**
 * Find the midpoint between two points
 * @param {object} a - the first point
 * @param {object} b - the second point
 * @param {string} getPoints - whether or not the point should be mirrored
 * @param {number} curve - the curve of the midpoint
 * @param {number} multiplier - multiplier to use, for other points
 * @returns {object} the midpoint and its mirror, if it has one
 */

 exports.findMidpoint = (a, b, getPoints = 'both', curve = 1, multiplier = .5) => {
    let canvasWidth = paper.view.size.width;
    let x = a.point().left.x + (b.point().left.x - a.point().left.x) * multiplier;
    let y = a.point().left.y + (b.point().left.y - a.point().left.y) * multiplier;

    let rightX = canvasWidth - x

     return {
         point: () => {
             return {
                 left: getPoints === 'right' ? new paper.Point(rightX, y) : new paper.Point(x, y),
                 right: getPoints === 'both' ? new paper.Point(rightX, y) : null
             }
         },
         curve: () => curve,
     }
 }

 /**
  * Get only the left point of a set of points
  * @param {object} point - the first point
  * @param {number} curve - new curve, if applicable
  * @returns {object} a control point with only the left point
  */
 
  exports.getLeft = (point, curve = null) => {
      return {
          point: () => {
              return {
                  left: point.point().left,
                  right: null
              }
          },
          curve: () => curve ? curve : point.curve(),
      }
  }

  /**
   * Get only the right point of a set of points
   * @param {object} point - the first point
   * @param {number} curve - new curve, if applicable
   * @returns {object} a control point with only the right point
   */
  
   exports.getRight = (point, curve = null) => {
       return {
           point: () => {
               return {
                   left: new paper.Point(paper.view.size.width - point.point().left.x, point.point().left.y),
                   right: null
               }
           },
           curve: () => curve ? curve : point.curve(),
       }
   }