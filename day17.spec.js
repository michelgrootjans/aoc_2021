const _ = require('lodash');

function Target(x1, x2, y1, y2) {
  const topLeft = {x: Math.min(x1, x2), y: Math.max(y1, y2)}
  const bottomRight = {x: Math.max(x1, x2), y: Math.min(y1, y2)}
  return {
    maxX: bottomRight.x,
    topLeft, bottomRight,
    overshootsX: x => bottomRight.x < x,
    overshootsY: y => y < bottomRight.y,
    withinX: x => {
      const leftOfTarget = x < topLeft.x;
      const rightOfTarget = bottomRight.x < x;
      return !leftOfTarget && !rightOfTarget;
    },
    withinY: y => {
      const overTarget = topLeft.y < y;
      const underTarget = y < bottomRight.y;
      return !overTarget && !underTarget;
    },
  };
}

function parseTarget(targetDescription) {
  const [[x1, x2], [y1, y2]] = targetDescription.replace('target area: ', '')
    .split(', ')
    .map(description => description.split('=')[1].split('..'))

  return Target(x1, x2, y1, y2);
}

function xValuesOf(initialXVelocity, target) {
  const result = [];
  let currentXPosition = 0
  let currentXVelocity = initialXVelocity;
  while (!target.overshootsX(currentXPosition)) {
    result.push(currentXPosition)
    if (currentXVelocity === 0) {
      result.push(currentXPosition)
      break;
    }
    currentXPosition = (_.last(result) || 0) + currentXVelocity;
    currentXVelocity = Math.max(currentXVelocity - 1, 0)
  }
  return result;
}

function yValuesOf(initialYVelocity, target, maxNumberOfSteps) {
  const result = [];
  let currentYPosition = 0
  let currentYVelocity = initialYVelocity;
  while (!target.overshootsY(currentYPosition)) {
    result.push(currentYPosition)
    currentYPosition = (_.last(result) || 0) + currentYVelocity;
    currentYVelocity = currentYVelocity - 1;
  }
  return result;
}

function highestPoint(targetDescription) {
  const target = parseTarget(targetDescription);

  let successfulXVelocities = [];
  for (let xVelocity = 0; xVelocity < target.maxX + 1; xVelocity++) {
    const xPositions = xValuesOf(xVelocity, target);
    const successfulXSteps = xPositions.map((x, index) => ({index, x}))
      .filter(step => target.withinX(step.x))
    if (successfulXSteps.length > 0) {
      successfulXVelocities.push({xVelocity, xPositions, length: xPositions.length, successfulXSteps});
    }
  }
  // console.log(successfulXVelocities.map(v => v.xVelocity))
  const succesfulSteps = _(successfulXVelocities)
    .map(vx => vx.successfulXSteps.map(step => step.index))
    .flatten()
    .uniq()
    .sort()
    .value()
  const maxNumberOfSteps = _(succesfulSteps).max() * 2;

  let successfulYVelocities = []
  for (let initialYVelocity = target.bottomRight.y; initialYVelocity < 1000; initialYVelocity++) {
    const yPositions = yValuesOf(initialYVelocity, target, maxNumberOfSteps);
    const successfulYSteps = yPositions.map((y, index) => ({index, y}))
      .filter(step => target.withinY(step.y));
    if (successfulYSteps.length > 0) {
      const maxHeight = _(yPositions).max()
      successfulYVelocities.push({initialYVelocity, yPositions, maxHeight, successfulYSteps});
    }
  }

  // console.log({target, successfuleXVelocities, succesfulSteps, maxNumberOfSteps});
  // console.log(_(successfulYVelocities).orderBy('maxHeight', 'desc').value())

  const successfulVelocities = []
  for (const yVelocity of _(successfulYVelocities).orderBy('maxHeight', 'desc').value()) for (const xVelocity of successfulXVelocities) {
    const [lastX, secondLastX] = _.reverse(xVelocity.xPositions);
    const xDrops = lastX === secondLastX;
    let xValues = []
    let yValues = []
    if (xDrops) {
      yValues = yVelocity.yPositions;

      const numberOfXesTOAdd = yValues.length - xVelocity.xPositions.length;
      if (numberOfXesTOAdd > 0) {
        const extraXes = Array(numberOfXesTOAdd).fill(lastX);
        xValues = [..._.reverse(xVelocity.xPositions), ...extraXes];
      } else {
        xValues = _(xVelocity.xPositions)
          .reverse()
          .take(yValues.length)
      }
    } else {
      xValues = _.reverse(xVelocity.xPositions);
      yValues = _.take(yVelocity.yPositions, xValues.length);
    }
    const xyValues = _.zip(xValues, yValues)
    const firstTargetHit = xyValues.find(xy => target.withinX(xy[0]) && target.withinY(xy[1]));
    if (firstTargetHit) {
      const maxHeight = yVelocity.maxHeight;
      successfulVelocities.push({xValues, yValues, firstTargetHit, maxHeight})
    }
  }

  const data = _([{x: 1, y: 1}, {x: 1, y: 1}, {x: 1, y: 2}])
    .uniqBy(({x, y}) => `${x},${y}`)
    .value();
  // console.log({data})

  const successfulInitialVelocities = _(successfulVelocities)
    // .map(v => [v.xValues[1], v.yValues[1]])
    .map(v => ({x: v.xValues[1], y: v.yValues[1]}))
    // .tap(console.log)
    .uniqBy(({x, y}) => `${x},${y}`)
    // .tap(console.log)
    .map(({x, y}) => [x, y])
    // .tap(console.log)
    .value()
  const numberOfSuccesfulInitialVelocities = successfulInitialVelocities.length;

  return {
    ..._(successfulVelocities).maxBy('maxHeight'),
    successfulInitialVelocities,
    numberOfSuccesfulInitialVelocities
  };
  // return 45;
}

describe('Trick Shot', () => {
  describe('highest point', () => {
    test('aoc example ', function () {
      expect(highestPoint('target area: x=20..30, y=-10..-5')).toMatchObject({
        firstTargetHit: [21, -10],
        maxHeight: 45
      })
    });
    test('my input ', function () {
      expect(highestPoint('target area: x=143..177, y=-106..-71')).toMatchObject({
        firstTargetHit: [153, -106],
        maxHeight: 5565
      })
    });
  })
  describe('successful velocities', () => {
    xtest('aoc example ', function () {
      const result = highestPoint('target area: x=20..30, y=-10..-5');
      // console.log(result)
      const successfulInitialVelocities = [
        [23, -10], [25, -9], [27, -5], [29, -6], [22, -6], [21, -7], [9, 0], [27, -7], [24, -5],
        [25, -7], [26, -6], [25, -5], [6, 8], [11, -2], [20, -5], [29, -10], [6, 3], [28, -7],
        [8, 0], [30, -6], [29, -8], [20, -10], [6, 7], [6, 4], [6, 1], [14, -4], [21, -6],
        [26, -10], [7, -1], [7, 7], [8, -1], [21, -9], [6, 2], [20, -7], [30, -10], [14, -3],
        [20, -8], [13, -2], [7, 3], [28, -8], [29, -9], [15, -3], [22, -5], [26, -8], [25, -8],
        [25, -6], [15, -4], [9, -2], [15, -2], [12, -2], [28, -9], [12, -3], [24, -6], [23, -7],
        [25, -10], [7, 8], [11, -3], [26, -7], [7, 1], [23, -9], [6, 0], [22, -10], [27, -6],
        [8, 1], [22, -8], [13, -4], [7, 6], [28, -6], [11, -4], [12, -4], [26, -9], [7, 4],
        [24, -10], [23, -8], [30, -8], [7, 0], [9, -1], [10, -1], [26, -5], [22, -9], [6, 5],
        [7, 5], [23, -6], [28, -10], [10, -2], [11, -1], [20, -9], [14, -2], [29, -7], [13, -3],
        [23, -5], [24, -8], [27, -9], [30, -7], [28, -5], [21, -10], [7, 9], [6, 6], [21, -5],
        [27, -10], [7, 2], [30, -9], [21, -8], [22, -7], [24, -9], [20, -6], [6, 9], [29, -5],
        [8, -2], [27, -8], [30, -5], [24, -7]
      ];
      for (let i = 0; i < successfulInitialVelocities.length; i++) {
        const [expectedX, expectedY] = successfulInitialVelocities[i]
        const actualVelocity = result.successfulInitialVelocities.filter(([x, y]) => x === expectedX && y === expectedY);
        // console.log({expectedX, expectedY, actualVelocity})
        expect(actualVelocity.length).toEqual(1)
        expect(actualVelocity[0]).toEqual([expectedX, expectedY])
      }
      for (let i = 0; i < result.successfulInitialVelocities.length; i++) {
        const [actualX, actualY] = result.successfulInitialVelocities[i];
        // console.log({actualX, actualY})
        const expectedVelocity = successfulInitialVelocities.filter(([x, y]) => x === actualX && y === actualY);
        expect(expectedVelocity.length).toEqual(1)
        expect([actualX, actualY]).toEqual(expectedVelocity[0])
      }
      expect(result.successfulInitialVelocities.length).toEqual(successfulInitialVelocities.length)
    });
    xtest('my input ', function () {
      expect(highestPoint('target area: x=143..177, y=-106..-71')).toMatchObject({
        numberOfSuccesfulVelocities: 112
      })
    });
  })
})