const _ = require('lodash')

const step = ({state, flashes = 0}) => {
  function Octopus(x, y, energy) {
    let flashed = false;

    return ({
      x, y,
      flashed: () => flashed,
      energy: () => energy,
      increaseEnergy: () => !flashed && energy++,
      neigborOf: o => {
        if(x-1 === o.x && y-1 === o.y) return true
        if(x === o.x && y-1 === o.y) return true
        if(x+1 === o.x && y-1 === o.y) return true

        if(x-1 === o.x && y === o.y) return true
        if(x+1 === o.x && y === o.y) return true

        if(x-1 === o.x && y+1 === o.y) return true
        if(x === o.x && y+1 === o.y) return true
        if(x+1 === o.x && y+1 === o.y) return true

        return false;
      },
      flash: () => {
        if (!flashed && energy > 9) {
          flashed = true;
          energy = 0;
          return true;
        }
        return false;
      },
    });
  }

  const octopi = _(state)
    .map((line, lineIndex) => line.map((energyLevel, columnIndex) => new Octopus(lineIndex, columnIndex, energyLevel)))
    .flatten()
    .value()


  function flash(octopus) {
    if (octopus.flash()) {
      const neighbors = octopi.filter(o => o.neigborOf(octopus));
      for (const neighbor of neighbors) neighbor.increaseEnergy()
      for (const neighbor of neighbors) flash(neighbor)
    }
  }

  for (const octopus of octopi) octopus.increaseEnergy()
  for (const octopus of octopi) flash(octopus)

  const newFlashes = octopi
    .filter(o => o.flashed())
    .length

  const newState = octopi.reduce((grid, octopus) => {
    grid[octopus.x][octopus.y] = octopus.energy();
    return grid;
  }, _.cloneDeep(state))

  return ({state: newState, flashes: flashes + newFlashes});
};

function steps(state, number) {
  return _(_.times(number))
    .reduce((s) => step(s), ({state, flashes: 0}))
    // .tap(console.log)
    .flashes;
}

function sync(state) {
  let newState = {state: _.cloneDeep(state), flashes: 0}
  for (let i = 1; i < 10000; i++) {
    newState = step(newState);
    if (newState.state.every(line => line.every(octopus => octopus === 0))) return i
  }
  return 0;
}

describe('Dumbo Octopus', () => {
  const aocExample = [
    [5, 4, 8, 3, 1, 4, 3, 2, 2, 3],
    [2, 7, 4, 5, 8, 5, 4, 7, 1, 1],
    [5, 2, 6, 4, 5, 5, 6, 1, 7, 3],
    [6, 1, 4, 1, 3, 3, 6, 1, 4, 6],
    [6, 3, 5, 7, 3, 8, 5, 4, 7, 8],
    [4, 1, 6, 7, 5, 2, 4, 6, 4, 5],
    [2, 1, 7, 6, 8, 4, 1, 7, 2, 1],
    [6, 8, 8, 2, 8, 8, 1, 1, 3, 4],
    [4, 8, 4, 6, 8, 4, 8, 5, 5, 4],
    [5, 2, 8, 3, 7, 5, 1, 5, 2, 6],
  ]
  describe('flashes', () => {
    test.each([
      [[[0]], [[1]], 0],
      [[[5]], [[6]], 0],
      [[[8]], [[9]], 0],
      [[[9]], [[0]], 1],

      [[
        [1, 2],
        [3, 4],
      ], [
        [2, 3],
        [4, 5],
      ], 0],

      [[
        [1, 2],
        [8, 9],
      ], [
        [4, 5],
        [0, 0],
      ], 2],
    ])('%p => %p with %d flashes', (state, expectedState, flashes) => {
      expect(step({state})).toEqual({state: expectedState, flashes});
      expect(steps(state, 1)).toEqual(step({state, flashes: 0}).flashes);
    });

    test('aoc simple example step 1', () => {
      expect(step({
        state: [
          [1, 1, 1, 1, 1],
          [1, 9, 9, 9, 1],
          [1, 9, 1, 9, 1],
          [1, 9, 9, 9, 1],
          [1, 1, 1, 1, 1]
        ]
      })).toEqual({
        state: [
          [3, 4, 5, 4, 3],
          [4, 0, 0, 0, 4],
          [5, 0, 0, 0, 5],
          [4, 0, 0, 0, 4],
          [3, 4, 5, 4, 3]
        ],
        flashes: 9
      });
    });
    test('aoc simple example step 2', () => {
      expect(step({
        state: [
          [3, 4, 5, 4, 3],
          [4, 0, 0, 0, 4],
          [5, 0, 0, 0, 5],
          [4, 0, 0, 0, 4],
          [3, 4, 5, 4, 3]
        ]
      })).toEqual({
        state: [
          [4, 5, 6, 5, 4],
          [5, 1, 1, 1, 5],
          [6, 1, 1, 1, 6],
          [5, 1, 1, 1, 5],
          [4, 5, 6, 5, 4],
        ],
        flashes: 0
      });
    });
    test('aoc simple 2 steps', () => {
      const state = [
          [1, 1, 1, 1, 1],
          [1, 9, 9, 9, 1],
          [1, 9, 1, 9, 1],
          [1, 9, 9, 9, 1],
          [1, 1, 1, 1, 1]
        ];
      expect(steps(state, 2)).toEqual(9);
    });

    test('aoc example: 10 steps', () => {
      expect(steps(aocExample, 10)).toEqual(204);
    });

    test('aoc example: 100 steps', () => {
      expect(steps(aocExample, 100)).toEqual(1656);
    });

    test('my input', () => {
      expect(steps(require('./day11.input'), 100)).toEqual(1637);
    });

    test('aoc example synced', () => {
      expect(sync(aocExample)).toEqual(195);
    });

    test('my input synced', () => {
      expect(sync(require('./day11.input'))).toEqual(242);
    });
  });
});