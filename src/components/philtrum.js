var controlPoint = require('./controlPoint');
var mouth = require('./mouth');
var nose = require('./nose');

exports.order = [
    {
        order: () => philtrumRightShadow(),
        iterations:  2,
        variation: 2,
        isOneShape: true,
        isClosed: false
    },
];

var philtrumRightShadow = () => {
    let topRight = controlPoint.findMidpoint(nose.points.noseTip, mouth.points.upperLip, 'both', .25, .15);
    let topLeft = controlPoint.findMidpoint(nose.points.noseTip, mouth.points.upperLip, 'both', .5, .38);

    let center = controlPoint.findMidpoint(nose.points.noseTip, mouth.points.cupidsBow, 'left', .2, .45);  

    return [topRight, topLeft, center ];
};