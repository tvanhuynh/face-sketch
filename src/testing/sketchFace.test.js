import React from 'react';
import Paper from 'paper';
import ReactDOM from 'react-dom';
import SketchFace from '../components/SketchFace';

var paper = require('paper');

const controls = document.createElement('div');
const canvas = document.createElement('canvas');
const array = ["array"];
const string = "string";
const object = {test: "object"};
const number = 0;
const boolean = true;
canvas.setAttribute('width', 500);
canvas.setAttribute('height', 500);
paper.setup(canvas);
const sketchFaceComponent = ReactDOM.render(<SketchFace />, controls); 

it('renders without crashing', () => {
  ReactDOM.unmountComponentAtNode(controls);
});

describe('calculatePoints', () => {
    it('will return {left: (125, 375), right: (375, 375)} coordinates with the input (.25, .75)', () => {
        const temp = sketchFaceComponent.calculatePoints(.25, .75);
        expect(temp.left.x).toEqual(125);
        expect(temp.left.y).toEqual(375);
        expect(temp.right.x).toEqual(375);
        expect(temp.right.y).toEqual(375);
    });
    it('will return {left: (0, 500), right: (500, 500)} coordinates with the input (.5, 1)', () => {
        const temp = sketchFaceComponent.calculatePoints(.5, 1);
        expect(temp.left.x).toEqual(0);
        expect(temp.left.y).toEqual(500);
        expect(temp.right.x).toEqual(500);
        expect(temp.right.y).toEqual(500);
    });
    it('will return {left: (-250, 500), right: (750, 500)} coordinates with the input (1, 1)', () => {
        const temp = sketchFaceComponent.calculatePoints(1, 1);
        expect(temp.left.x).toEqual(-250);
        expect(temp.left.y).toEqual(500);
        expect(temp.right.x).toEqual(750);
        expect(temp.right.y).toEqual(500);
    });
    it('will reject parameters outside of range', () => {
        expect(() => {sketchFaceComponent.calculatePoints(1.1, 1.1)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(3, .5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(.2, 1.4)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(-4, -5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(.5, -.5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(-4, .2)}).toThrow();
    });
    it('will reject parameters that are not numbers', () => {
        expect(() => {sketchFaceComponent.calculatePoints(string, .5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(.5, string)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(boolean, .5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(.5, boolean)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(array, .5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(.5, array)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(object, .5)}).toThrow();
        expect(() => {sketchFaceComponent.calculatePoints(.5, object)}).toThrow();
    });
    it('will throw if there is an invalid canvas', () => {
        paper.view.size.width = null;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = string;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = array;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = object;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = boolean;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = -100;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = 0;
        expect(() => {sketchFaceComponent.calculatePoints(.4, .4)}).toThrow();
        paper.view.size.width = 500;
    })
});

describe('drawSymmetric', () => {
    it('will reject invalid parameters', () => {
        expect(() => {sketchFaceComponent.drawSymmetric(array, [1], [1])}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(string, [1], [1])}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(boolean, [1], [1])}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(number, [1], [1])}).toThrow();

        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), object, [1])}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), string, [1])}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), boolean, [1])}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), number, [1])}).toThrow();

        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), [1], object)}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), [1], string)}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), [1], boolean)}).toThrow();
        expect(() => {sketchFaceComponent.drawSymmetric(new paper.Path(), [1], number)}).toThrow();
    });
});

describe('makeControl', () => {
    it('will reject invalid parameters', () => {
        expect(() => {sketchFaceComponent.makeControl(string, number)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(string, boolean)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(string, object)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(string, array)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(number, string)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(boolean, string)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(object, string)}).toThrow();
        expect(() => {sketchFaceComponent.makeControl(array, string)}).toThrow();
    });
    it('will produce a div with a label and input inside', () => {
        const temp = sketchFaceComponent.makeControl("test1", "test2");
        expect(temp.type).toEqual("div");
        expect(temp.props.children[0].type).toEqual("label");
        expect(temp.props.children[1].type).toEqual("input");
    });
});