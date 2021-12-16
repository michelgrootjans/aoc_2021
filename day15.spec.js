const _ = require('lodash');

function Node(x, y, weight) {
  let visited = false;
  let distance = 1000 * 1000;
  return {
    x,
    y,
    weight,
    setDistance: d => distance = d,
    getDistance: () => distance,
    updateDistance: (d) => {
      const candidateistance = d + weight;
      distance = Math.min(distance, candidateistance);
    },
    markAsVisited: () => visited = true,
    visited: () => visited,
    unvisited: () => !visited,
    toString: () => ({x, y, weight, distance, visited})
  };
}

function parseMap(map) {
  return _(map)
    .map((line, y) => line.split('').map((weight, x) => Node(x, y, parseInt(weight))))
    .flatten()
    .value();
}

function neigborsOf(node, map) {
  const neighbors = [
    map.find(n => n.x === node.x - 1 && n.y === node.y),
    map.find(n => n.x === node.x + 1 && n.y === node.y),
    map.find(n => n.x === node.x && n.y - 1 === node.y),
    map.find(n => n.x === node.x && n.y + 1 === node.y),
  ];
  return _.compact(neighbors);
}

function lowestTotalRisk(nodes) {

  let currentNode = nodes[0];
  currentNode.setDistance(0);
  for (let i = 0; i < nodes.length; i++) {
    neigborsOf(currentNode, nodes)
      .filter(n => n.unvisited())
      .forEach(n => n.updateDistance(currentNode.getDistance()));
    currentNode.markAsVisited()

    currentNode = _(nodes)
      .filter(n => n.unvisited())
      .minBy(n => n.getDistance())
  }

  return _.last(nodes).getDistance();
}

const mappedNumbers = {'1': '2', '2': '3', '3': '4', '4': '5', '5': '6', '6': '7', '7': '8', '8': '9', '9': '1'}

function mapLine(line) {
  return _(line).map(n => mappedNumbers[n]).join('');
}

const growLine = line => {
  const line1 = line;
  const line2 = mapLine(line1);
  const line3 = mapLine(line2);
  const line4 = mapLine(line3);
  const line5 = mapLine(line4);
  return line1 + line2 + line3 + line4 + line5;
};

function fiveTimes(map) {
  const lines1 = map.map(growLine);
  const lines2 = lines1.map(mapLine);
  const lines3 = lines2.map(mapLine);
  const lines4 = lines3.map(mapLine);
  const lines5 = lines4.map(mapLine);
  return [
    ...lines1,
    ...lines2,
    ...lines3,
    ...lines4,
    ...lines5,
  ];
}

describe('Chiton', () => {
  describe('lowest total risk', () => {
    test('2 paths', () => {
      expect(lowestTotalRisk(parseMap(['11', '21']))).toEqual(2)
    });
    test('2 paths', () => {
      expect(lowestTotalRisk(parseMap(['112', '211']))).toEqual(3)
    });
    test('aoc example', () => {
      const aocInput = [
        '1163751742',
        '1381373672',
        '2136511328',
        '3694931569',
        '7463417111',
        '1319128137',
        '1359912421',
        '3125421639',
        '1293138521',
        '2311944581'
      ]
      expect(lowestTotalRisk(parseMap(aocInput))).toEqual(1 + 1 + 2 + 1 + 3 + 6 + 5 + 1 + 1 + 1 + 5 + 1 + 3 + 2 + 3 + 2 + 1 + 1)
    });
    test('my input', () => {
      const input = require('./day15.input');
      expect(lowestTotalRisk(parseMap(input))).toEqual(508)
    });
  })
  describe('five times lowest total risk', () => {
    test('2 paths', () => {
      expect(fiveTimes([
        '12',
        '34'
      ])).toEqual([
        '1223344556',
        '3445566778',
        '2334455667',
        '4556677889',
        '3445566778',
        '5667788991',
        '4556677889',
        '6778899112',
        '5667788991',
        '7889911223',
      ]);
    });
    test('aoc example', () => {
      const input = [
        '1163751742',
        '1381373672',
        '2136511328',
        '3694931569',
        '7463417111',
        '1319128137',
        '1359912421',
        '3125421639',
        '1293138521',
        '2311944581'
      ]
      expect(lowestTotalRisk(parseMap(fiveTimes(input)))).toEqual(315)
    });
    xtest('my input', () => {
      const input = require('./day15.input');
      console.log('five times ...')
      const map = fiveTimes(input);
      console.log('done')
      console.log('parse map ...')
      const nodes = parseMap(map);
      console.log('done')
      console.log('total risk ...')
      expect(lowestTotalRisk(nodes)).toEqual(315)
      console.log('done')
    });
  })
});