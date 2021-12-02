const _ = require('lodash/fp');
const map = _.map.convert({cap: false});

const countIncreases = (measurements) => {
  return measurements.reduce((acc, item) => {
    if(acc.previous < item) return {count: acc.count+1, previous: item}
    return {count: acc.count, previous: item};
  }, {count: 0, previous: 100000}).count;
};

describe('count increases', () => {
  test.each([
    [[], 0],
    [[1], 0],
    [[2, 1], 0],
    [[1, 2], 1],
    [[199,200,208,210,200,207,240,269,260,263], 7],
    [require('./day1.input'), 1752],
  ])('case => %d', (list, expectedCount) => expect(countIncreases(list)).toEqual(expectedCount));
});


const increaseWindow = (measurements) => {
  function toWindows(value, index) {
    return _.flow(
      _.drop(index),
      _.take(3),
    )(measurements)
  }

  const sliding = _.flow(
    map(toWindows),
    _.map(_.sum),
  )(measurements);
  return countIncreases(sliding)
};

describe('increase window', () => {
  test.each([
    [[], 0],
    [[1], 0],
    [[1, 2], 0],
    [[1, 2, 3], 0],
    [[1, 2, 3, 4], 1],
    [[4, 3, 2, 1], 0],
    [[199,200,208,210,200,207,240,269,260,263], 5],
    [require('./day1.input'), 1781],
  ])('case => %d', (list, expectedCount) => expect(increaseWindow(list)).toEqual(expectedCount));
});