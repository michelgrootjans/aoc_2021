const _ = require('lodash/fp');
const range = require("./Range");
const map = _.map.convert({cap: false});

const Fish = state => {
  const tick = () => {
    const newState = {
      0: state[1],
      1: state[2],
      2: state[3],
      3: state[4],
      4: state[5],
      5: state[6],
      6: state[7] + state[0],
      7: state[8],
      8: state[0]
    };
    return Fish(newState)
  };
  return ({
    state,
    tick,
    sum: () => state[0] + state[1] + state[2] + state[3] + state[4] + state[5] + state[6] + state[7] + state[8],
  });
};

const emptyState = {
  0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
}

const initialize = initialFish => initialFish.reduce((state, fish) => ({...state, [fish]: state[fish] + 1}), emptyState);

const evolve = (initialFish, days=1) => {
  const initialState = initialize(initialFish)
  return range(1, days)
    .reduce((state, _) => state.tick(), Fish(initialState))
    .sum();
};

describe('increase window', () => {
  test.each([
    [[6], 1],
    [[1], 1],
    [[0], 2],
  ])('1 fish', (input, output) => {
    expect(evolve(input)).toEqual(output)
  });

  describe('aoc example', () => {
    test.each([
      [[3, 4, 3, 1, 2], 5],
      [[2, 3, 2, 0, 1], 6],

      [[0, 1, 0, 5, 6, 7, 8], 9],
    ])('sample', (input, output) => {
      expect(evolve(input)).toEqual(output)
    });

    test('18 days', function () {
      expect(evolve([3, 4, 3, 1, 2], 18)).toEqual(26)
    });
    test('80 days', function () {
      expect(evolve([3, 4, 3, 1, 2], 80)).toEqual(5934)
    });
    test('256 days', function () {
      expect(evolve([3, 4, 3, 1, 2], 256)).toEqual(26984457539)
    });
    test('my input for 80 days', function () {
      expect(evolve(require('./day6.input'), 80)).toEqual(375482)
    });
    test('my input for 256 days', function () {
      expect(evolve(require('./day6.input'), 256)).toEqual(1689540415957)
    });
  });
});