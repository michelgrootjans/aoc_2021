const _ = require('lodash/fp');
const range = require("./Range");
const map = _.map.convert({cap: false});

const initialState = {
  0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0
}

const nextFish = fish => {
  if (fish <= 0) return 6;
  return fish - 1;
};

const tick = (originalFish) => {
  const evolvedFish = originalFish.map(fish => nextFish(fish));
  const numberOfFishToCreate = originalFish.filter(fish => fish === 0).length
  const createdFish = Array(numberOfFishToCreate).fill(8);

  return [...evolvedFish, ...createdFish];
};

const evolve = (originalFish, days=1) => {
  return range(1, days)
    .reduce((fish, _) => tick(fish), originalFish)
    .length;
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
    xtest('256 days', function () {
      expect(evolve([3, 4, 3, 1, 2], 256)).toEqual(26984457539)
    });
    test('my input for 80 days', function () {
      expect(evolve(require('./day6.input'), 80)).toEqual(375482)
    });
    xtest('my input for 256 days', function () {
      expect(evolve(require('./day6.input'), 256)).toEqual(375482)
    });
  });
});