var controlPoint = require('./controlPoint');
exports.points = {
    cheek: new controlPoint.createPoint(this, .31, .475, 1, false),
    cheekShadowTop: new controlPoint.createPoint(this, .275, .506, .5, false),
    cheekShadowMiddle: new controlPoint.createPoint(this, .187, .68, .5, false),
    cheekShadowBottom: new controlPoint.createPoint(this, .156, .845, .75, false),
    shadowEye: new controlPoint.createPoint(this, .253, .436, .75, false),
    cheekConcave: new controlPoint.createPoint(this, .295, .595, .435),
    jaw: new controlPoint.createPoint(this, .255, .76, .67),
    chinShadow: new controlPoint.createPoint(this, 0, .923, .5, false, true),
    chin: new controlPoint.createPoint(this, .08, .935, .417)
}

exports.order = [
    {
        order: [exports.points.cheek, exports.points.cheekConcave, exports.points.jaw, exports.points.chin],
        iterations: 3,
        variation: 5,
        isOneShape: true,
        isClosed: false,
        isShadow: false,
    },
    {
        order: [
            exports.points.shadowEye,
            exports.points.cheekShadowTop,
            exports.points.cheekShadowMiddle,
            exports.points.cheekShadowBottom,
            exports.points.chin,
            exports.points.chinShadow
        ],
        iterations: 2,
        variation: 10,
        isOneShape: true,
        isClosed: false,
        isShadow: false,
    },
    {
        order: [
            exports.points.shadowEye,
            exports.points.cheekShadowTop,
            exports.points.cheekShadowMiddle,
            exports.points.cheekShadowBottom,
            controlPoint.getLeft(exports.points.chin),
            controlPoint.getLeft(exports.points.jaw),
            controlPoint.getLeft(exports.points.cheekConcave),
            controlPoint.getLeft(exports.points.cheek),
        ],
        variation: 0,
        isOneShape: true,
        isShadow: true,
    },
    {
        order: [
            exports.points.chin,
            exports.points.chinShadow
        ],
        variation: 0,
        isOneShape: true,
        isShadow: true,
    },
];

exports.redraw = [
    this,
]