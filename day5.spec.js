const _ = require("lodash/fp");
const range = require("./Range");

function toPoints(line) {
  const start = line[0];
  const end = line[1];
  if (start[0] === end[0]) {
    return range(start[1], end[1]).map(n => [start[0], n]);
  } else if (start[1] === end[1]) {
    return range(start[0], end[0]).map(n => [n, start[1]]);
  } else {
    return []
  }
}

const overlaps = lines => {
  const pointOccurences = _.flow(
    _.map(toPoints),
    _.flatten,
    _.countBy(point => '' + point),
    _.toPairs,
    _.filter(occurence => occurence[1] > 1),
  )(lines)

  return pointOccurences.length
};

describe('hydrothermal venture', () => {
  test('one line', () => {
    const lines = [[[0,0], [0,2]]];
    expect(overlaps(lines)).toEqual(0)
  });
  test('two parallel lines', () => {
    const lines = [
      [[0,0], [0,2]],
      [[2,0], [2,2]],
    ];
    expect(overlaps(lines)).toEqual(0)
  });
  test('two crossing lines', () => {
    const lines = [
      [[1,0], [1,2]],
      [[0,1], [2,1]],
    ]; // lines cross at [1,1]
    expect(overlaps(lines)).toEqual(1)
  });

  test('aoc input', () => {
    const lines = [
      [[0, 9], [5, 9]],
      [[8, 0], [0, 8]],
      [[9, 4], [3, 4]],
      [[2, 2], [2, 1]],
      [[7, 0], [7, 4]],
      [[6, 4], [2, 0]],
      [[0, 9], [2, 9]],
      [[3, 4], [1, 4]],
      [[0, 0], [8, 8]],
      [[5, 5], [8, 2]],
    ]
    expect(overlaps(lines)).toEqual(5)
  });

  test('my input', () => {
    const lines = require('./day5.input');
    expect(overlaps(lines)).toEqual(7414)
  });
});