const _ = require('lodash/fp');
const map = _.map.convert({cap: false});

const State = (state = {position: 0, depth: 0, aim: 0}) => {
  const {position, depth, aim} = state;
  return ({
    forward: (distance) => State({...state, position: position + distance, depth: depth + (aim * distance)}),
    down: (distance) => State({...state, aim: aim + distance}),
    up: (distance) => State({...state, aim: aim - distance}),
    answer: position * depth,
  });
};

const toOperation = (command) => {
  switch (command[0]) {
    case 'forward':return state => state.forward(command[1]);
    case 'down':return state => state.down(command[1]);
    case 'up':return state => state.up(command[1]);
  }
};

const dive = commands => {
  const state = _.flow(
    _.map(toOperation),
    _.reduce((state, operation) => operation(state), State())
  )(commands)
  return state.answer;
};

describe('dive', () => {
  test.each([
    [[['forward', 1]], 1*0],
    [[['down', 1]], 0*1],
    [[
      ['down', 1],
      ['forward', 1],
    ], 1*1],
    [[
      ['forward', 5],
      ['down', 5],
      ['forward', 8],
      ['up', 3],
      ['down', 8],
      ['forward', 2],
    ], 15*60],
    [require('./day2.input'), 1727785422],
  ])('case => %d', (commands, expectedCount) => expect(dive(commands)).toEqual(expectedCount));
});