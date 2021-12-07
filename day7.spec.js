const _ = require('lodash/fp');
const range = require("./Range");
const map = _.map.convert({cap: false});

function calculateCosumption(distance) {
  if(distance === 0) return 0;
  if(distance === 1) return 1;
  return distance + calculateCosumption(distance-1)
}

function consumptionFor(position, positions) {
  return positions.map(p => Math.abs(p - position))
    .map(distance => calculateCosumption(distance))
    .reduce((acc, consumption) => acc + consumption)
}

function align(positions) {
  const minPosition = Math.min(...positions)
  const maxPosition = Math.max(...positions)
  const potentialPositions = range(minPosition, maxPosition)

  const potentialConsumptions = potentialPositions.map(position => consumptionFor(position, positions))
  const minConsumption = Math.min(...potentialConsumptions)

  // console.log({minPosition, maxPosition, potentialPositions, minConsumption})

  return minConsumption;
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