const _ = require('lodash/fp');
const map = _.map.convert({cap: false});

const fish = (original) => {
  return original.map(o => o-1);
};

describe('increase window', () => {
  test.each([
    [[6], [5]],
    [[1], [0]],
  ])('1 fish', (input, output) => {
    expect(fish(input)).toEqual(output)
  });
});