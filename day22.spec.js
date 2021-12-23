const _ = require('lodash')

function Cube([x, y, z]) {
  const description = `(${x},${y},${z})`
  return {
    x, y, z,
    description,
    matches: other => x === other.x && y === other.y && z === other.z,
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

    const add = cubes => {
      return _([...cubes, ...newCubes])
        .uniqBy(c => c.description)
        .value();
    };

    const subtract = cubes => {
      function inside(cube) {
        return newCubes.some(newCube => newCube.matches(cube))
      }
      function outside(cube) {
        return !inside(cube)
      }

      return cubes.filter(c => outside(c));
    };

    return {
      apply: description.startsWith('on') ? add : subtract
    };
  }

// e.g. on x=10..12,y=10..12,z=10..12
  const range = toRange(description);

  return {
    apply: (cubes) => range.apply(cubes)
  }
}

function Reactor(cubes = []) {
  const step = (step, cubes) => Cuboid(step).apply(cubes);

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

    [['off x=1..1,y=1..1,z=1..1'], 0],

    [['on x=1..1,y=1..1,z=1..1', 'off x=1..1,y=1..1,z=1..1'], 0],
    [['on x=1..1,y=1..1,z=1..1', 'off x=2..2,y=2..2,z=2..2'], 1],

    //aoc example
    [[
      'on x=10..12,y=10..12,z=10..12',
    ], 27],
    [[
      'on x=10..12,y=10..12,z=10..12',
      'on x=11..13,y=11..13,z=11..13',
    ], 46],
    [[
      'on x=10..12,y=10..12,z=10..12',
      'on x=11..13,y=11..13,z=11..13',
      'off x=9..11,y=9..11,z=9..11',
    ], 38],
    [[
      'on x=10..12,y=10..12,z=10..12',
      'on x=11..13,y=11..13,z=11..13',
      'off x=9..11,y=9..11,z=9..11',
      'on x=10..10,y=10..10,z=10..10',
    ], 39],
  ])('%s => %d', (steps, on) => {
    expect(Reactor().execute(steps)).toMatchObject({on});
  });
  xtest('my input', () => {
    expect(Reactor().execute(require('./day22.input'))).toMatchObject({on: 0});
  });
});