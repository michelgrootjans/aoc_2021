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

function lowestTotalRisk(map) {
  const nodes = parseMap(map);

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

describe('Chiton', () => {
  describe('lowest total risk', () => {
    test('2 paths', () => {
      expect(lowestTotalRisk([
        '11',
        '21'
      ])).toEqual(2)
    });
    test('2 paths', () => {
      expect(lowestTotalRisk([
        '112',
        '211'
      ])).toEqual(3)
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
      expect(lowestTotalRisk(aocInput)).toEqual(1 + 1 + 2 + 1 + 3 + 6 + 5 + 1 + 1 + 1 + 5 + 1 + 3 + 2 + 3 + 2 + 1 + 1)
      // expect(lowestTotalRisk(aocInput)).toEqual(1 + 1 + 2 + 1 + 3 + 6 + 5 + 1 + 1 + 1 + 5 + 1 + 3 + 2 + 3 + 2 + 1 + 1)
    });
    test('my input', () => {
      const input = require('./day15.input');
      expect(lowestTotalRisk(input)).toEqual(508)
    });
  })
});