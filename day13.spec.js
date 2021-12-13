const _ = require('lodash');


const foldUp = foldLine => dot => {
  if (dot.y < foldLine) return dot;

  const mirror = (position, foldLine) => 2 * foldLine - position;
  return {...dot, y: mirror(dot.y, foldLine)}
};

const foldLeft = foldLine => dot => {
  if (dot.x > foldLine) return dot;

  const mirror = (position, foldLine) => foldLine * 2 - position;
  return {...dot, x: mirror(dot.x, foldLine)}
};

function foldOnce(state) {
  const instruction = state.instructions[0];
  const foldOperation = instruction.y ? foldUp(instruction.y) : foldLeft(instruction.x);
  return {
    dots: _(state.dots)
      .map(foldOperation)
      .uniqWith((left, right) => left.x === right.x && left.y === right.y)
      // .tap(console.log)
      .value(),
    instructions: _.drop(state.instructions, 1)
  };
}

const fold = (state) => {
  return state.instructions
    .reduce((s, instruction) => foldOnce(s), state)
    .dots.length
};

describe('Transparent Origami', () => {
  describe('fold one line', () => {
    test('fold up one dot', function () {
      // .x
      // --
      // ..
      const state = {
        dots: [{x: 1, y: 0}],
        instructions: [{y: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 1, y: 0}]});
      expect(fold(state)).toEqual(1)
    });
    test('fold up three dots', function () {
      const state = {
        dots: [{x: 0, y: 4}, {x: 0, y: 5}, {x: 0, y: 6}],
        instructions: [{y: 3}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 0, y: 2}, {x: 0, y: 1}, {x: 0, y: 0}]});
    });
    test('fold up two dots', function () {
      // .x
      // --
      // x.
      const state = {
        dots: [{x: 1, y: 0}, {x: 0, y: 2}],
        instructions: [{y: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 1, y: 0}, {x: 0, y: 0}]});
      expect(fold(state)).toEqual(2)
    });
    test('fold up two overlapping dots', function () {
      // .x
      // --
      // .x
      const state = {
        dots: [{x: 1, y: 0}, {x: 1, y: 2}],
        instructions: [{y: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 1, y: 0}]});
      expect(fold(state)).toEqual(1)
    });
    test('fold left one dot', function () {
      // .|x
      // .|.
      const state = {
        dots: [{x: 2, y: 0}],
        instructions: [{y: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 2, y: 0}]});
      expect(fold(state)).toEqual(1)
    });
    test('fold up three dots', function () {
      const state = {
        dots: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
        instructions: [{x: 3}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 6, y: 0}, {x: 5, y: 0}, {x: 4, y: 0}]});
    });
    test('fold left two dots', function () {
      // .|x
      // x|.
      const state = {
        dots: [{x: 2, y: 0}, {x: 0, y: 1}],
        instructions: [{x: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 2, y: 0}, {x: 2, y: 1}]});
      expect(fold(state)).toEqual(2)
    });
    test('fold left two overlapping dots', function () {
      // x|x
      // .|.
      const state = {
        dots: [{x: 2, y: 0}, {x: 0, y: 0}],
        instructions: [{x: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 2, y: 0}]});
      expect(fold(state)).toEqual(1)
    });
    test('aoc example', () => {
      const state = {
        dots: [
          {x: 6, y: 10}, {x: 0, y: 14}, {x: 9, y: 10}, {x: 0, y: 3}, {x: 10, y: 4}, {x: 4, y: 11},
          {x: 6, y: 0}, {x: 6, y: 12}, {x: 4, y: 1}, {x: 0, y: 13}, {x: 10, y: 12}, {x: 3, y: 4},
          {x: 3, y: 0}, {x: 8, y: 4}, {x: 1, y: 10}, {x: 2, y: 14}, {x: 8, y: 10}, {x: 9, y: 0}],
        instructions: [{y: 7}, {x: 5}]
      }
      expect(foldOnce(state).dots.length).toEqual(17);
    });
    test('my input', () => {
      const state = require('./day13.input')
      expect(foldOnce(state).dots.length).toEqual(763);
    });
  });
});