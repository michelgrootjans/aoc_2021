const _ = require('lodash')

function Cube([x, y, z]) {
  const description = `(${x},${y},${z})`
  return {
    x, y, z,
    description
  };
}

function* permutations(head, ...tail) {
  let remainder = tail.length ? permutations(...tail) : [[]];
  for (let r of remainder) for (let h of head) yield [h, ...r];
}

function Cuboid(description) {
  function getSide(side) {
    const min = side[0];
    const max = side[1];
    return _.range(min, max +1);
  }

  function toRange(description) {
    const sides = description
      .replaceAll(/[\sa-z=]/ig, '')
      .split(',')
      .map(side => side.split('..').map(n => parseInt(n)));

    const coordinates = permutations(getSide(sides[0]), getSide(sides[1]), getSide(sides[2]));
    const newCubes = [];
    for (const xyz of coordinates) {
      newCubes.push(Cube(xyz))
    }

    return {
      apply: cubes => {
        return _([...cubes, ...newCubes])
          .uniqBy(c => c.description)
          .value();
      }
    };
  }

// e.g. on x=10..12,y=10..12,z=10..12
  const range = toRange(description);

  return {
    apply: (cubes) => range.apply(cubes)
  }
}

function Reactor(cubes = []) {
  const step = (step, cubes) => {
    return Cuboid(step).apply(cubes)
  };

  const execute = ([head, ...tail]) => {
    if (!head) return Reactor(cubes);
    return Reactor(step(head, cubes)).execute(tail)
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
    [['on x=10..12,y=10..12,z=10..12'], 3 * 3 * 3],
    [['on x=1..1,y=1..1,z=1..1', 'on x=2..2,y=2..2,z=2..2'], 2],
    [['on x=1..1,y=1..1,z=1..1', 'on x=1..1,y=1..1,z=1..1'], 1],
  ])('%s => %d', (steps, on) => {
    const reactor = Reactor().execute(steps);

    expect(reactor).toMatchObject({on});
  });
});