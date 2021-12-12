const _ = require('lodash');

function Cave(name) {
  const connections = [];
  return {
    name,
    isBig: () => name === name.toUpperCase(),
    isEnd: () => name === 'end',
    connections: () => connections,
    addConnection: cave => {
      if(cave.name === 'start') return;
      if(name === 'end') return;
      connections.push(cave);
    },
  };
}

const getCave = (name, map) => {
  let cave = map.caves.find(c => c.name === name);
  if (!cave) {
    cave = Cave(name);
    map.caves.push(cave);
  }
  return cave;
};

function buildMap(edges) {
  return edges.reduce((map, edge) => {
    const caveNames = edge.split('-');
    const cave1 = getCave(caveNames[0], map);
    const cave2 = getCave(caveNames[1], map);
    cave1.addConnection(cave2)
    cave2.addConnection(cave1)
    return map;
  }, {caves: []});
}

const canVisit = (cave, path) => cave.isBig() || !path.includes(cave.name);

function explore(cave, nextCaves, currentPath) {
  return _(nextCaves)
    .filter(c => canVisit(c, currentPath))
    .map(c => {
      if (c.isEnd()) return {path: [...currentPath, c.name]};
      return explore(c, c.connections(), [...currentPath, c.name]);
    })
    .flatten()
    .value();
}

const countPaths = (edges) => {
  const map = buildMap(edges);

  const start = map.caves.find(c => c.name === 'start');
  const paths = _.flatten(explore(start, start.connections(), [start.name]))

  return paths.length;
};

describe('Passage Pathing', () => {
  test('start-end', () => {
    expect(countPaths(['start-end'])).toEqual(1)
  });
  test('start-a-end', () => {
    expect(countPaths(['start-a', 'a-end'])).toEqual(1)
  });
  test('start-a-b-end', () => {
    expect(countPaths(['start-a', 'a-b', 'b-end'])).toEqual(1)
  });
  test('2 paths', () => {
    expect(countPaths(['start-a', 'start-b', 'a-end', 'b-end'])).toEqual(2)
  });
  test('2 paths', () => {
    expect(countPaths(['start-a', 'start-b', 'a-b', 'a-end', 'b-end'])).toEqual(4)
  });
  test('aoc example 1', () => {
    expect(countPaths([
      'start-A',
      'start-b',
      'A-c',
      'A-b',
      'b-d',
      'A-end',
      'b-end'
    ])).toEqual(10)
  });
  test('aoc example 2', () => {
    expect(countPaths([
      'dc-end',
      'HN-start',
      'start-kj',
      'dc-start',
      'dc-HN',
      'LN-dc',
      'HN-end',
      'kj-sa',
      'kj-HN',
      'kj-dc'
    ])).toEqual(19)
  });
  test('my input', () => {
    expect(countPaths(require('./day12.input'))).toEqual(3761)
  });
})