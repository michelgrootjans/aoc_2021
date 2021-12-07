const _ = require('lodash/fp');
const range = require("./Range");
const map = _.map.convert({cap: false});

function consumptionFor(position, positions) {
  return positions.map(p => Math.abs(p - position))
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
    [[1,2,3], 2],
    [[1,2,4], 3],
    [[16,1,2,0,4,2,7,1,2,14], 37],
    [require('./day7.input'), 343441],
  ])('horizontal alignment', (input, output) => {
    expect(align(input)).toEqual(output)
  });

});