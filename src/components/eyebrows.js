var controlPoint = require('./controlPoint');

exports.points = {
   browsInnerTop: new controlPoint.createPoint(this, .084, .352, 1),
   browsInnerBottom: new controlPoint.createPoint(this, .069, .381, 1),
   browsOuter: new controlPoint.createPoint(this, .268, .382, 1),
   browsPointTop: new controlPoint.createPoint(this, .215, .337, .5),
   browsPointBottom: new controlPoint.createPoint(this, .203, .357, 1),
}

exports.order = [
    {
        order: [exports.points.browsOuter, exports.points.browsPointTop, exports.points.browsInnerTop, exports.points.browsInnerBottom, exports.points.browsPointBottom],
        iterations: 4,
        variation: 3,
        isOneShape: false,
        isClosed: true,
        isShadow: false,
    },
    {
        order: [exports.points.browsOuter, exports.points.browsPointTop, exports.points.browsInnerTop, exports.points.browsInnerBottom, exports.points.browsPointBottom],
        variation: 0,
        isOneShape: false,
        isShadow: true,
    },
];

exports.redraw = [
    this,
]