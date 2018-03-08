var controlPoint = require('./controlPoint');
var paper = require('paper');

exports.points = {
    innerCorner: new controlPoint.createPoint(this, .076, .457, .5),
    outerCorner: new controlPoint.createPoint(this, .222, .448, .25),

    innerTop: new controlPoint.createPoint(this, .122, .421, 1),
    outerTop: new controlPoint.createPoint(this, .186, .425, 1),

    innerBottom: new controlPoint.createPoint(this, .113, .460, 1),
    outerBottom: new controlPoint.createPoint(this, .187, .469, 1),

    innerHoodCorner: new controlPoint.createPoint(this, .081, .436, 1),
    innerHoodTop:new controlPoint.createPoint(this, .116, .406, 1),
    outerHoodTop:new controlPoint.createPoint(this, .19, .403, 1),
    outerHoodCorner: new controlPoint.createPoint(this, .232, .43, 1),

    innerBagTop:new controlPoint.createPoint(this, .153, .489, 1),
    outerBagTop:new controlPoint.createPoint(this, .193, .488, 1),
}

exports.order = [
    {
        order: [
            exports.points.innerCorner, 
            exports.points.innerTop, 
            exports.points.outerTop, 
            exports.points.outerCorner, 
            exports.points.outerBottom, 
            exports.points.innerBottom
        ],
        iterations: 3,
        variation: 3,
        isOneShape: false,
        isClosed: true,
        isShadow: false,
    },
    {
        order: [
            exports.points.innerCorner,
            exports.points.innerTop, 
            exports.points.outerTop, 
            exports.points.outerCorner, 
        ],
        iterations: 10,
        variation: 6,
        isOneShape: false,
        isClosed: false,
        isShadow: false,
    },
    {
        order: () => eyeBags(),
        variation: 0,
        isOneShape: false,
        isShadow: true,
    },
    {
        order: [
            exports.points.outerBottom,
            exports.points.innerBottom,
            exports.points.innerCorner,
            exports.points.innerBagTop,
            exports.points.outerBagTop,
            exports.points.outerCorner
        ],
        variation: 0,
        isOneShape: false,
        isShadow: true,
    },
    {
        order: [
            exports.points.innerHoodCorner,
            exports.points.innerHoodTop,
            exports.points.outerHoodTop,
            exports.points.outerHoodCorner
        ],
        iterations: 2,
        variation: 3,
        isOneShape: false,
        isClosed: false,
        isShadow: false,
    },
    {
        order: () => corneaPoints(),
        iterations: 3,
        variation: 3,
        isOneShape: false,
        isClosed: false,
        isShadow: false,
    },
    {
        order: () => pupilPoints(),
        iterations: 6,
        variation: 4,
        isOneShape: false,
        isClosed: true,
        isShadow: false,
    }
];

exports.redraw = [
    this,
]

var eyeCenter = () => { return {
    x: () => exports.points.outerCorner.point().left.x + (exports.points.innerCorner.point().left.x - exports.points.outerCorner.point().left.x) / 2.1,
    y: () => exports.points.outerCorner.point().left.y + (exports.points.outerTop.point().left.y - exports.points.outerCorner.point().left.y) / 2,
    r: () => (exports.points.innerCorner.point().left.x - exports.points.outerCorner.point().left.x) / 5,
}};

var corneaPoints = () => {
    let circle = new paper.Path.Circle(new paper.Point(eyeCenter().x(), eyeCenter().y()), eyeCenter().r());
    let intersection = circle.intersect(this.path[0]);
    if (intersection.segments) {
        intersection.divideAt(intersection.length * .5847);
        intersection.divideAt(intersection.length * .87719);
        let temp = intersection.segments.map(i => i.point);
        temp = temp.map(i => controlPoint.createMirrorPoints(i, 1));
        temp.push(temp.shift());  
        temp.push(temp.shift());
        circle.remove();
        intersection.remove();
        return temp[0] ? temp : [];
    }
    return [];
}

var pupilPoints = () => {
    let circle = new paper.Path.Circle(new paper.Point(eyeCenter().x(), eyeCenter().y()), eyeCenter().r()  / 2.5);
    let temp = circle.segments.map(i => i.point);
    temp = temp.map(i => controlPoint.createMirrorPoints(i, 1) );
    circle.remove();
    return temp;
}

var eyeBags = () => {
    return [
        exports.points.innerCorner,
        exports.points.innerTop, 
        exports.points.outerTop, 
        exports.points.outerCorner,
        controlPoint.findMidpoint(exports.points.outerTop, exports.points.outerBottom, 'both', 1, .25),
        controlPoint.findMidpoint(exports.points.innerTop, exports.points.innerBottom, 'both', 1, .25),
    ];
}