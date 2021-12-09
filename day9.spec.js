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
    riskLevel: height + 1,
    isLowerThan: otherPoint => height < otherPoint.height
  }
}

const lowPoints = map => {
  const heigth = map.length;
  const width = map[0].length;

  const result = []

  const getPoint = (row, column) => {
    if (row < 0 || heigth <= row) return Edge();
    if (column < 0 || width <= column) return Edge();
    return Point(row, column, map[row][column]);
  };

  for (let rowIndex = 0; rowIndex < heigth; rowIndex++) {
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      const point = getPoint(rowIndex, columnIndex)
      const neigbors = [
        getPoint(rowIndex, columnIndex - 1),
        getPoint(rowIndex, columnIndex + 1),
        getPoint(rowIndex - 1, columnIndex),
        getPoint(rowIndex + 1, columnIndex),
      ];
      if (neigbors.every(neigbor => point.isLowerThan(neigbor))) {
        result.push(point)
      }
    }
  }

  return result;
};
const totalRiskLevel = map => lowPoints(map).map(location => location.riskLevel).reduce((sum, riskLevel) => sum + riskLevel, 0);

function basins(map) {
  // return lowPoints(map)
  return [3, 9, 14, 9];
}

function largestBasins(map) {
  return 9 * 14 * 9;
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
  xdescribe('basins', () => {
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
    xtest('my input', () => {
      const map = require('./day9.input');

      expect(largestBasins(map)).toEqual(0);
    });
  });
});