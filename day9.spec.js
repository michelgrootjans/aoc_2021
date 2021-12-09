const _ = require('lodash/fp');

const Edge = () => {
  return {
    height: 10,
    isLowerThan: () => false
  }
};

const Point = (row, column, height) => {
  return {
    row,
    column,
    height,
    state: `(${row},${column},${height})`,
    riskLevel: height + 1,
    isLowerThan: otherPoint => height < otherPoint.height
  }
}

const getPoint = (row, column, map) => {
  if (row < 0 || map.length <= row) return Edge();
  if (column < 0 || map[row].length <= column) return Edge();
  return Point(row, column, map[row][column]);
};

function neighborsOf(point, map) {
  return [
    getPoint(point.row, point.column - 1, map),
    getPoint(point.row, point.column + 1, map),
    getPoint(point.row - 1, point.column, map),
    getPoint(point.row + 1, point.column, map),
  ];
}

const lowPoints = map => {
  const result = []

  for (let row = 0; row < map.length; row++) {
    for (let column = 0; column < map[row].length; column++) {
      const point = getPoint(row, column, map)
      if (neighborsOf(point, map).every(neigbor => point.isLowerThan(neigbor))) {
        result.push(point)
      }
    }
  }

  return result;
};
const totalRiskLevel = map => lowPoints(map).map(location => location.riskLevel).reduce((sum, riskLevel) => sum + riskLevel, 0);

function higherNeigborsOf(points, map) {
  return _.flow(
    _.map(p => neighborsOf(p, map).filter(neighbor => neighbor.height < 9 && neighbor.height > p.height)),
    _.flatten,
    _.uniqBy(p => p.state),
    // _.tap(neighbors => console.log({from: points.map(p => p.state), to: neighbors.map(p => p.state)}))
  )(points)
}

function basins(map) {
  const toBasin = (points) => {
    if(points.length === 0) return []
    const higherNeighbors = higherNeigborsOf(points, map);
    return [...points, ...toBasin(higherNeighbors)]
  };

  return _.flow(
    _.map(point => toBasin([point])),
    _.map(basin => _.uniqBy(p => p.state)(basin)),
    _.map(basin => basin.length),
  )(lowPoints(map));
}

function largestBasins(map) {
  return _(basins(map))
    .sortBy(size => size)
    .reverse()
    .take(3)
    .reduce((total, basin) => total * basin, 1);
}

describe('smoke basin', () => {
  describe('risk levels', () => {
    test('simple map', () => {
      const map = [
        [1, 0],
        [1, 1],
      ];

      expect(lowPoints(map)).toMatchObject([{row: 0, column: 1, height:0}]);
      expect(totalRiskLevel(map)).toEqual(1);
    });
    test('aoc example', () => {
      const map = [
        [2, 1, 9, 9, 9, 4, 3, 2, 1, 0],
        [3, 9, 8, 7, 8, 9, 4, 9, 2, 1],
        [9, 8, 5, 6, 7, 8, 9, 8, 9, 2],
        [8, 7, 6, 7, 8, 9, 6, 7, 8, 9],
        [9, 8, 9, 9, 9, 6, 5, 6, 7, 8],
      ];

      expect(lowPoints(map)).toMatchObject([
        {row: 0, column: 1, height:1},
        {row: 0, column: 9, height:0},
        {row: 2, column: 2, height:5},
        {row: 4, column: 6, height:5},
      ]);
      expect(totalRiskLevel(map)).toEqual(2 + 1 + 6 + 6);
    });
    test('my input', () => {
      const map = require('./day9.input');

      expect(totalRiskLevel(map)).toEqual(462);
    });
  });
  describe('basins', () => {
    test('aoc example', () => {
      const map = [
        [2, 1, 9, 9, 9, 4, 3, 2, 1, 0],
        [3, 9, 8, 7, 8, 9, 4, 9, 2, 1],
        [9, 8, 5, 6, 7, 8, 9, 8, 9, 2],
        [8, 7, 6, 7, 8, 9, 6, 7, 8, 9],
        [9, 8, 9, 9, 9, 6, 5, 6, 7, 8],
      ];

      expect(basins(map)).toEqual([3, 9, 14, 9]);
      expect(largestBasins(map)).toEqual(9 * 14 * 9);
    });
    test('my input', () => {
      const map = require('./day9.input');

      expect(largestBasins(map)).toEqual(1397760);
    });
  });
});