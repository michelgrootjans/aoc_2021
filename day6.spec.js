const _ = require('lodash/fp');
const range = require("./Range");
const map = _.map.convert({cap: false});

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

const evolve = (originalFish, days) => range(1, days).reduce((fish, _) => tick(fish), originalFish);

describe('increase window', () => {
  test.each([
    [[6], [5]],
    [[1], [0]],
    [[0], [6, 8]],
  ])('1 fish', (input, output) => {
    expect(tick(input)).toEqual(output)
  });

  describe('aoc example', () => {
    test.each([
      [
        [3, 4, 3, 1, 2],
        [2, 3, 2, 0, 1]
      ],
      [
        [2, 3, 2, 0, 1],
        [1, 2, 1, 6, 0, 8]
      ],

      [
        [0, 1, 0, 5, 6, 7, 8],
        [6, 0, 6, 4, 5, 6, 7, 8, 8]],
    ])('sample', (input, output) => {
      expect(tick(input)).toEqual(output)
    });

    test('18 days', function () {
      expect(evolve([3, 4, 3, 1, 2], 18).length).toEqual(26)
    });
    test('80 days', function () {
      expect(evolve([3, 4, 3, 1, 2], 80).length).toEqual(5934)
    });
    test('my input', function () {
      expect(evolve(require('./day6.input'), 80).length).toEqual(375482)
    });
  });
});