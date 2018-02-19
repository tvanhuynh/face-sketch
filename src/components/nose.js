var controlPoint = require('./controlPoint');

exports.points = {
   top: new controlPoint.createPoint(this, .066, .59, 0),
   middle: new controlPoint.createPoint(this, .074, .632, 1),
   bottom: new controlPoint.createPoint(this, .035, .65, 1),
   nostrilStart: new controlPoint.createPoint(this, .052, .633, 1),
   nostrilMiddle: new controlPoint.createPoint(this, .036, .632, 1),
   nostrilEnd: new controlPoint.createPoint(this, .015, .6532, 1),
   noseTip: new controlPoint.createPoint(this, 0, .655, .5, false, true),
}

exports.order = [
    {
        order: [exports.points.top, exports.points.middle, exports.points.bottom, exports.points.nostrilStart, exports.points.nostrilMiddle, exports.points.nostrilEnd, exports.points.noseTip],
        iterations: 3,
        variation: 3,
        isOneShape: true,
        isClosed: false
    },
];