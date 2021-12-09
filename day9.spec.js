const lowPoints = map => {
  const heigth = map.length;
  const width = map[0].length;

  const result = []

  const getLocation = (rowIndex, columnIndex) => {
    if (rowIndex < 0 || heigth <= rowIndex) return 10;
    if (columnIndex < 0 || width <= columnIndex) return 10;
    return map[rowIndex][columnIndex];
  };

  for (let rowIndex = 0; rowIndex < heigth; rowIndex++) {
    for (let columnIndex = 0; columnIndex < width; columnIndex++) {
      const location = getLocation(rowIndex, columnIndex)
      const neigbors = [
        getLocation(rowIndex, columnIndex - 1),
        getLocation(rowIndex, columnIndex + 1),
        getLocation(rowIndex - 1, columnIndex),
        getLocation(rowIndex + 1, columnIndex),
      ];
      if (neigbors.every(neigbor => location < neigbor)) {
        result.push(location)
      }
    }
  }

  return result;
};
const totalRiskLevel = map => lowPoints(map).map(height => height + 1).reduce((sum, height) => sum + height, 0);

describe('smoke basin', () => {
  describe('risk levels', () => {
    test('simple map', () => {
      const map = [
        [1, 0],
        [1, 1],
      ];

      expect(lowPoints(map)).toEqual([0]);
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

      expect(lowPoints(map)).toEqual([1, 0, 5, 5]);
      expect(totalRiskLevel(map)).toEqual(2 + 1 + 6 + 6);
    });
    test('my input', () => {
      const map = require('./day9.input');

      expect(totalRiskLevel(map)).toEqual(462);
    });
  });
});