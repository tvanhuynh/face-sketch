var controlPoint = require('./controlPoint');

exports.points = {
    top: new controlPoint.createPoint(this, .068, .075, 1, false),
    middle: new controlPoint.createPoint(this, -.253, .49, 1, false),
    bottom: new controlPoint.createPoint(this, -.305, .89, 1, false),
}

exports.curl = 0;

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
        isClosed: false,
        curl: 1,
        volume: 20,
    },
]

exports.redraw = [
    this,
]

exports.isHair = true;

exports.addNew = () => {
    exports.order.push({
        order: [
            new controlPoint.createPoint(this, .068, .075, 1, false),
            new controlPoint.createPoint(this, -.253, .49, 1, false),
            new controlPoint.createPoint(this, -.305, .89, 1, false),
        ],
        iterations: 3,
        variation: 10,
        isOneShape: true,
        isClosed: false,
        curl: 1,
        volume: 20,
    });
}

exports.getOrderParentIndex = point => {
    let result = null;
    for (let i = 0; i < this.order.length; i++) {
        for (let j = 0; j < this.order[i].order.length; j++ ) {
            if (point === this.order[i].order[j]) {
                result = i;
            }
        }
    }

    return result;
}