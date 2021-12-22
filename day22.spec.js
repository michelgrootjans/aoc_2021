const _ = require('lodash')

function Reactor(cubes = []) {
  const step = (step, cubes) => {
    return [{}];
  };

  const execute = ([head, ...tail]) => {
    if(!head) return Reactor(cubes);

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
  ])('%s => %d', (steps, on) => {
    const reactor = Reactor().execute(steps);

    expect(reactor).toMatchObject({on});
  });
});