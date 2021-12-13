const _ = require('lodash');
const state = require("./day13.input");


const foldUp = foldLine => dot => {
  if (dot.y < foldLine) return dot;

  const mirror = (position, foldLine) => 2 * foldLine - position;
  return {...dot, y: mirror(dot.y, foldLine)}
};

const foldLeft = foldLine => dot => {
  if (dot.x > foldLine) return {...dot, x: dot.x - foldLine - 1};

  const mirror = (position, foldLine) => foldLine * 2 - position;
  return {...dot, x: mirror(dot.x, foldLine) - foldLine - 1}
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

const foldAll = state => state.instructions
  .reduce((s, instruction) => foldOnce(s), state);

const fold = (state) => foldAll(state).dots.length;

function display(points) {
  const maxX = Math.max(...points.map(p => p.x))
  const maxY = Math.max(...points.map(p => p.y));
  const lines = []
  for (let y = 0; y <= maxY; y++) {
    let line = ''
    for (let x = 0; x <= maxX; x++) {
      if(points.find(p => p.x === x && p.y === y)) line += 'x'
      else line += '.'
    }
    lines.push(line);
  }
  return lines.join('/n');
}

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
      // .|x => x
      const state = {
        dots: [{x: 2, y: 0}],
        instructions: [{x: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 0, y: 0}]});
      expect(fold(state)).toEqual(1)
    });
    test('fold left three dots', function () {
      // x x x | . . . => x x x
      const state = {
        dots: [{x: 0, y: 0}, {x: 1, y: 0}, {x: 2, y: 0}],
        instructions: [{x: 3}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 2, y: 0}, {x: 1, y: 0}, {x: 0, y: 0}]});
    });
    test('fold left two dots', function () {
      // .|x => x
      // x|.    x
      const state = {
        dots: [{x: 2, y: 0}, {x: 0, y: 1}],
        instructions: [{x: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 0, y: 0}, {x: 0, y: 1}]});
      expect(fold(state)).toEqual(2)
    });
    test('fold left two overlapping dots', function () {
      // x|x => x
      // .|.
      const state = {
        dots: [{x: 2, y: 0}, {x: 0, y: 0}],
        instructions: [{x: 1}]
      };
      expect(foldOnce(state)).toMatchObject({dots: [{x: 0, y: 0}]});
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
      expect(foldAll(state).dots.length).toEqual(16);
      expect(fold(state)).toEqual(16);
    });
    test('my input', () => {
      const state = require('./day13.input')
      expect(foldOnce(state).dots.length).toEqual(763);
    });
  });
  describe('fold completely', () => {
    test('', () => expect(display([])).toEqual(''));
    test('x', () => expect(display([{x: 0, y: 0}])).toEqual('x'));
    test('.x', () => expect(display([{x: 1, y: 0}])).toEqual('.x'));
    test('../n.x', () => expect(display([{x: 1, y: 1}])).toEqual('../n.x'));
    test('big number', () => expect(display([{x: 6, y: 4}])).toEqual('' +
      '......./n' +
      '......./n' +
      '......./n' +
      '......./n' +
      '......x'
    ));

    test('aoc example', () => {
      const state = {
        dots: [
          {x: 6, y: 10}, {x: 0, y: 14}, {x: 9, y: 10}, {x: 0, y: 3}, {x: 10, y: 4}, {x: 4, y: 11},
          {x: 6, y: 0}, {x: 6, y: 12}, {x: 4, y: 1}, {x: 0, y: 13}, {x: 10, y: 12}, {x: 3, y: 4},
          {x: 3, y: 0}, {x: 8, y: 4}, {x: 1, y: 10}, {x: 2, y: 14}, {x: 8, y: 10}, {x: 9, y: 0}],
        instructions: [{y: 7}, {x: 5}]
      }
      const dots = foldAll(state).dots;

      expect(display(dots)).toEqual('' +
        'xxxxx/n' +
        'x...x/n' +
        'x...x/n' +
        'x...x/n' +
        'xxxxx'
      );
    });

    test('my input', () => {
      const state = require('./day13.input')
      expect(display(foldAll(state).dots)).toEqual("" +
        "..xx.." + ".xxx." + ".xx.." + ".xxx." + "...x." + ".xx.." + "x..x." + ".xxx/n" +
        ".x..x." + "x..x." + "x..x." + "x..x." + "...x." + "x..x." + "x..x." + "x..x/n" +
        ".x..x." + "x..x." + "...x." + "x..x." + "...x." + "x..x." + "xxxx." + "x..x/n" +
        ".xxxx." + ".xxx." + "...x." + ".xxx." + "...x." + "xxxx." + "x..x." + ".xxx/n" +
        ".x..x." + ".x.x." + "x..x." + ".x.x." + "...x." + "x..x." + "x..x." + ".x.x/n" +
        ".x..x." + "x..x." + ".xx.." + "x..x." + "xxxx." + "x..x." + "x..x." + "x..x");
    });

  });
});