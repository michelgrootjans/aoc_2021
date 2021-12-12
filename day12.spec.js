const _ = require('lodash');

const toString = o => o.toString();

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
    toString: () => `${name}, connections: [${connections.map(c => c.name).join(', ')}]`
  };
}

const getCave = (name, map) => {
  let cave = map.caves.find(c => c.name === name);
  if (!cave) {
    cave = new Cave(name);
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
  }, ({caves: []}));
}

function countPathsUtil(cave1, cave2, pathCount, map) {
  // If current cave is same as destination, then increment count
  if (cave1.name === cave2.name) {
    pathCount++;
  } else {
    const connections = cave1.connections();
    for (let i = 0; i < connections.length; i++) {
      const nextCave = connections[i];
      pathCount = countPathsUtil(nextCave, cave2, pathCount, map);
    }
  }
  return pathCount;
}

const canVisit = (cave, path) => cave.isBig() || !path.includes(cave.name);

function traverse(cave, nextCaves, currentPath) {
  return _(nextCaves)
    .filter(c => canVisit(c, currentPath))
    // .tap(c => console.log({currentPath, canVisit: c.map(c => c.name)}))
    .map(c => {
      if (c.isEnd()) return {path: [...currentPath, c.name]};
      return traverse(c, c.connections(), [...currentPath, c.name]);
    })
    // .tap(console.log)
    .flatten()
    .value();
}

const countPaths = (edges) => {
  const map = buildMap(edges);

  let pathCount = 0;
  const start = map.caves.find(c => c.name === 'start');
  // const end = map.caves.find(c => c.name === 'end');
  // pathCount = countPathsUtil(start, end, pathCount, map)
  const paths = _.flatten(traverse(start, start.connections(), [start.name]))

  console.log({edges, caves: map.caves.map(toString), pathCount, paths});

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