const range = require("./Range");

const cache = {[0]: 0, [1]: 1}

function calculateConsumption(distance) {
  if (distance in cache) return cache[distance];

  return cache[distance] = distance + calculateConsumption(distance - 1)
}

function consumptionFor(position, positions) {
  return positions.map(p => Math.abs(p - position))
    .map(distance => calculateConsumption(distance))
    .reduce((acc, consumption) => acc + consumption)
}

function align(positions) {
  const potentialPositions = range(Math.min(...positions), Math.max(...positions))

  const potentialConsumptions = potentialPositions.map(position => consumptionFor(position, positions))
  return Math.min(...potentialConsumptions);
}

describe('crabs', () => {
  test.each([
    [[1,2,3], (1 + 0 + 1)],
    [[1,2,4], (1 + 0 + (1+2))],
    [[16,1,2,0,4,2,7,1,2,14], 168],
    [require('./day7.input'), 98925151],
  ])('horizontal alignment', (input, output) => {
    expect(align(input)).toEqual(output)
  });
});