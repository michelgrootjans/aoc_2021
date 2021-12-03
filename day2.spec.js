const _ = require('lodash/fp');
const map = _.map.convert({cap: false});

const State = (state = {position: 0, depth: 0}) => ({
  ...state,
  forward: (distance) => State({...state, position: position + distance}),
});

const forward = distance => state => State({...state, position: state.position + distance});

const down = depth => state => State({...state, depth: state.depth + depth});

const up = depth => state => State({...state, depth: state.depth - depth});

const toOperation = (command) => {
  switch (command[0]) {
    case 'forward':return forward(command[1]);
    case 'down':return down(command[1]);
    case 'up':return up(command[1]);
  }
};

const dive = commands => {
  const state = _.flow(
    _.map(toOperation),
    _.reduce((state, operation) => operation(state), State())
  )(commands)
  return state.position * state.depth;
};

describe('dive', () => {
  test.each([
    [[['forward', 1]], 1*0],
    [[['down', 1]], 0*1],
    [[
      ['forward', 1],
      ['down', 1],
    ], 1*1],
    [[
      ['forward', 5],
      ['down', 5],
      ['forward', 8],
      ['up', 3],
      ['down', 8],
      ['forward', 2],
    ], 15*10],
    [require('./day2.input'), 1840243],
  ])('case => %d', (commands, expectedCount) => expect(dive(commands)).toEqual(expectedCount));
});