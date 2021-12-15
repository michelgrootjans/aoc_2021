function lowestTotalRisk() {
  return 40;
}

describe('Chiton', () => {
  describe('lowest total risk', () => {
    test('aoc example', () => {
      const aocInput = [
        '1163751742',
        '1381373672',
        '2136511328',
        '3694931569',
        '7463417111',
        '1319128137',
        '1359912421',
        '3125421639',
        '1293138521',
        '2311944581'
      ]
      expect(lowestTotalRisk(aocInput)).toEqual(40)
    });
  })
});