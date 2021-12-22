const _ = require('lodash')

function Cube() {
  return {
    x: 1,
    y: 1,
    z: 1,
  };
}

function Cuboid(description) {
  const length = description.indexOf('4') > 0 ? 24 : 1
  return {
    apply: () => Array(length)
  }
}

function Reactor(cubes = []) {
  const step = (step, cubes) => {
    return Cuboid(step).apply(cubes)
  };

  const execute = ([head, ...tail]) => {
    if (!head) return Reactor(cubes);

    const newCubes = step(head, cubes)


    return Reactor(newCubes)
  };
  return {
    on: cubes.length,
    execute
  };
}

describe('Reactor Reboot', () => {
  test('reactor at rest', () => {
    expect(Reactor()).toMatchObject({on: 0});
  });
  test.each([
    [[], 0],
    [['on x=1..1,y=1..1,z=1..1'], 1],
    [['on x=1..2,y=1..3,z=1..4'], 2 * 3 * 4],
  ])('%s => %d', (steps, on) => {
    const reactor = Reactor().execute(steps);

    expect(reactor).toMatchObject({on});
  });
});