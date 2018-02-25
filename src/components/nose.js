var controlPoint = require('./controlPoint');
var philtrum = require('./philtrum');
var eyebrows = require('./eyebrows');

exports.points = {
   top: new controlPoint.createPoint(this, .066, .59, .5),
   middle: new controlPoint.createPoint(this, .074, .632, 1),
   bottom: new controlPoint.createPoint(this, .035, .65, 1),
   nostrilStart: new controlPoint.createPoint(this, .052, .633, 1),
   nostrilMiddle: new controlPoint.createPoint(this, .036, .632, 1),
   nostrilEnd: new controlPoint.createPoint(this, .015, .6532, 1),
   noseTip: new controlPoint.createPoint(this, 0, .655, .5, false, true),
   bridgeTop: new controlPoint.createPoint(this, .026, .451, .5, false),
   bridgePoint: new controlPoint.createPoint(this, .035, .612, .25, false),
   noseTipShadow: new controlPoint.createPoint(this, 0, .642, .5, false, true),
   nostrilEndShadow: new controlPoint.createPoint(this, .017, .636, .5,),
}

exports.order = [
    {
        order: () => nose(),
        iterations: 3,
        variation: 3,
        isOneShape: true,
        isClosed: false
    },
    {
        order: () => shadow(),
        iterations: 2,
        variation: 3,
        isOneShape: true,
        isClosed: false
    },
    {
        order: () => shadowFill(),
        variation: 0,
        isOneShape: true,
        isShadow: true,
    },
];

exports.redraw = [
    this,
    philtrum,
]

var nose = () => {
    return [
        controlPoint.findMidpoint(exports.points.top, exports.points.bridgeTop, 'left', 0, .25),
        exports.points.top, exports.points.middle,
        exports.points.bottom,
        exports.points.nostrilStart,
        exports.points.nostrilMiddle,
        exports.points.nostrilEnd,
        exports.points.noseTip
    ]
}

var shadow = () => {
    return [
        controlPoint.findMidpoint(eyebrows.points.browsInnerBottom, exports.points.bridgeTop, 'left', 0, .25),
        exports.points.bridgeTop,
        controlPoint.getLeft(exports.points.bridgePoint),
        controlPoint.getLeft(exports.points.nostrilEndShadow),
        exports.points.noseTipShadow,
        controlPoint.getRight(exports.points.nostrilEndShadow),
        controlPoint.findMidpoint(exports.points.bridgePoint, exports.points.nostrilStart, 'right', .5, .35),
        controlPoint.getRight(exports.points.middle),
        controlPoint.getRight(exports.points.bottom)
    ]
}

var shadowFill = () => {
    return [
        controlPoint.findMidpoint(exports.points.bridgePoint, exports.points.nostrilStart, 'right', .5, .35),
        controlPoint.getRight(exports.points.nostrilEndShadow),
        exports.points.noseTipShadow,
        controlPoint.getLeft(exports.points.nostrilEndShadow),
        controlPoint.getLeft(exports.points.bridgePoint),
        exports.points.bridgeTop,
        controlPoint.findMidpoint(exports.points.top, exports.points.bridgeTop, 'left', 0, .25),
        controlPoint.getLeft(exports.points.top),
        exports.points.middle,
        exports.points.bottom,
        exports.points.nostrilStart,
        exports.points.nostrilMiddle,
        exports.points.nostrilEnd,
        exports.points.noseTip,
    ]
}