var controlPoint = require('./controlPoint');
var paper = require('paper')

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
    // {
    //     order: () => lowerLipShadow(),
    //     iterations: 3,
    //     variation: 4,
    //     isOneShape: true,
    //     isClosed: false
    // },
    // {
    //     order: () => upperLipShadow(),
    //     iterations: 2,
    //     variation: 3,
    //     isOneShape: true,
    //     isClosed: false
    // },
];

var lowerLip = () => {
    let outer = controlPoint.findMidpoint(exports.points.lowerLip, exports.points.lip);
    return [exports.points.lowerLipShadowCenter, exports.points.lowerLipShadow, outer, exports.points.lowerLip];
};

// var lowerLipShadow = () => {
//     let canvasWidth = paper.view.size.width;

//     let outer = controlPoint.findMidpoint(exports.points.lip, exports.points.mouthLineTips);
//     let centerY = exports.points.lip.point().left.y + (exports.points.lowerLip.point().left.y - exports.points.lip.point().left.y) / 8;    
//     let center = {
//         point: () => {
//             return {
//                 left: new paper.Point(canvasWidth/2, centerY),
//                 right: null,
//             }
//         },
//         curve: () => .5,
//     }
//     return [exports.points.lip, outer, center];
// };

// var upperLipShadow = () => {
//     let canvasWidth = paper.view.size.width;

//     let outer = controlPoint.findMidpoint(exports.points.mouthLineTips, exports.points.upperLip);
//     outer = controlPoint.findMidpoint(exports.points.mouthLineTips, outer, true, .25);
//     let inner = controlPoint.findMidpoint(exports.points.mouthLineCenter, exports.points.mouthLineTips, true, 1);
//     let centerY = exports.points.mouthLineCenter.point().left.y - (exports.points.mouthLineCenter.point().left.y - exports.points.cupidsBow.point().left.y) / 2;    
//     let center = {
//         point: () => {
//             return {
//                 left: new paper.Point(canvasWidth/2, centerY),
//                 right: null,
//             }
//         },
//         curve: () => .4,
//     }
//     return [exports.points.lip, outer, inner, center];
// };