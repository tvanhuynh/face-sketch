var controlPoint = require('./controlPoint');
var philtrum = require('./philtrum');

exports.points = {
    lip: new controlPoint.createPoint(this, .12, .76, 0),
    lowerLip: new controlPoint.createPoint(this, .055, .8, 1),
    upperLip: new controlPoint.createPoint(this, .045, .715, .405),
    cupidsBow: new controlPoint.createPoint(this, 0, .725, .425, false, true),
    mouthLineCenter: new controlPoint.createPoint(this, 0, .752, .5, false, true),
    mouthLineTips: new controlPoint.createPoint(this, .061, .745, .5),

    lowerLipShadow: new controlPoint.createPoint(this, .045, .82, .25),
    lowerLipShadowCenter: new controlPoint.createPoint(this, 0, .814, 1, false, true),
}

exports.order = [
    {
        order: [exports.points.lip, exports.points.upperLip, exports.points.cupidsBow ],
        iterations: 3,
        variation: 5,
        isOneShape: true,
        isClosed: false
    },
    {
        order: [exports.points.lip, exports.points.mouthLineTips, exports.points.mouthLineCenter],
        iterations: 3,
        variation: 5,
        isOneShape: true,
        isClosed: false
    },
    {
        order: () => lowerLip(),
        iterations: 3,
        variation: 4,
        isOneShape: true,
        isClosed: true
    },
]

exports.redraw = [
    this,
    philtrum,
]

var lowerLip = () => {
    let outer = controlPoint.findMidpoint(exports.points.lowerLip, exports.points.lip);
    return [exports.points.lowerLipShadowCenter, exports.points.lowerLipShadow, outer, exports.points.lowerLip];
}