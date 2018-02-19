var controlPoint = require('./controlPoint');

exports.points = {
    top: new controlPoint.createPoint(this, .068, .075, 1, false),
    middle: new controlPoint.createPoint(this, -.253, .49, 1, false),
    bottom: new controlPoint.createPoint(this, -.305, .89, 1, false),
}

exports.order = [
    {
        order: [
            exports.points.top,
            exports.points.middle,
            exports.points.bottom
        ],
        iterations: 3,
        variation: 10,
        isOneShape: true,
        isClosed: false
    },
]

exports.redraw = [
    this,
]