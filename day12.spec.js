const _ = require('lodash');

function Cave(name) {
  const connections = [];
  return {
    name,
    isSmall: () => name === name.toLowerCase(),
    isBig: () => name === name.toUpperCase(),
    isEnd: () => name === 'end',
    connections: () => connections,
    addConnection: cave => {
      if (cave.name === 'start') return;
      if (name === 'end') return;
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
const canVisit = (cave, path) => cave.isBig() || !path.some(c => c.name === cave.name);

function canVisitSmallCave(cave, path) {
  if(!path.map(c => c.name).includes(cave.name)) return true;
  const smallCaves = path
    .filter(c => c.isSmall())
    .map(c => c.name)

  const uniq = _.uniq(smallCaves);
  const canVisit = uniq.length === smallCaves.length;
  // console.log({canVisit, path: path.map(c => c.name)})
  return canVisit;
}

const canVisit2 = (cave, path) => cave.isBig() || canVisitSmallCave(cave, path);

function explore(cave, nextCaves, currentPath) {
  return _(nextCaves)
    .filter(c => canVisit(c, currentPath))
    .map(c => {
      if (c.isEnd()) return {path: [...currentPath, c]};
      return explore(c, c.connections(), [...currentPath, c]);
    })
    .flatten()
    .value();
}

function explore2(cave, nextCaves, currentPath) {
  return _(nextCaves)
    .filter(c => canVisit2(c, currentPath))
    .map(c => {
      if (c.isEnd()) return {path: [...currentPath, c]};
      return explore2(c, c.connections(), [...currentPath, c]);
    })
    .flatten()
    .value();
}

const countPaths = (edges) => {
  const map = buildMap(edges);

  const start = map.caves.find(c => c.name === 'start');
  const paths = _.flatten(explore(start, start.connections(), [start]))

  return paths.length;
};

const countPaths2 = (edges) => {
  const map = buildMap(edges);

  const start = map.caves.find(c => c.name === 'start');
  const paths = _.flatten(explore2(start, start.connections(), [start]))

  return paths.length;
};

describe('Passage Pathing', () => {
  describe('explore small caves once', () => {
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
    test('aoc example 3', () => {
      expect(countPaths([
        'fs-end',
        'he-DX',
        'fs-he',
        'start-DX',
        'pj-DX',
        'end-zg',
        'zg-sl',
        'zg-pj',
        'pj-he',
        'RW-he',
        'fs-DX',
        'pj-RW',
        'zg-RW',
        'start-pj',
        'he-WI',
        'zg-he',
        'pj-fs',
        'start-RW',
      ])).toEqual(226)
    });
    test('my input', () => {
      expect(countPaths(require('./day12.input'))).toEqual(3761)
    });
  });

  describe('explore single small cave twice', () => {
    test('start-end', () => {
      expect(countPaths2(['start-end'])).toEqual(1)
    });
    test('start-a-end', () => {
      expect(countPaths2(['start-a', 'a-end'])).toEqual(1)
    });
    test('start-a-b-end', () => {
      expect(countPaths2(['start-a', 'a-b', 'b-end'])).toEqual(1)
    });
    test('2 paths', () => {
      expect(countPaths2(['start-a', 'start-b', 'a-end', 'b-end'])).toEqual(2)
    });
    test('2 paths', () => {
      const paths = ['start-a-end', 'start-a-b-end', 'start-a-b-a-end', 'start-b-end', 'start-b-a-end', 'start-b-a-b-end'];
      expect(countPaths2(['start-a', 'start-b', 'a-b', 'a-end', 'b-end'])).toEqual(paths.length);
    });
    test('aoc example 1', () => {
      expect(countPaths2([
        'start-A',
        'start-b',
        'A-c',
        'A-b',
        'b-d',
        'A-end',
        'b-end'
      ])).toEqual(36)
    });
    test('aoc example 2', () => {
      expect(countPaths2([
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
      ])).toEqual(103)
    });
    test('aoc example 3', () => {
      expect(countPaths2([
        'fs-end',
        'he-DX',
        'fs-he',
        'start-DX',
        'pj-DX',
        'end-zg',
        'zg-sl',
        'zg-pj',
        'pj-he',
        'RW-he',
        'fs-DX',
        'pj-RW',
        'zg-RW',
        'start-pj',
        'he-WI',
        'zg-he',
        'pj-fs',
        'start-RW',
      ])).toEqual(3509)
    });
    test('my input', () => {
      expect(countPaths2(require('./day12.input'))).toEqual(99138)
    });
  });
});