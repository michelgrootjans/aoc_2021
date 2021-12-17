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
  for (let xVelocity = 0; xVelocity < target.maxX; xVelocity++) {
    const xPositions = xValuesOf(xVelocity, target);
    const successfulXSteps = xPositions.map((x, index) => ({index, x}))
      .filter(step => target.withinX(step.x))
    if (successfulXSteps.length > 0) {
      successfulXVelocities.push({xVelocity, xPositions, length: xPositions.length, successfulXSteps});
    }
  }
  const succesfulSteps = _(successfulXVelocities)
    .map(vx => vx.successfulXSteps.map(step => step.index))
    .flatten()
    .uniq()
    .sort()
    .value()
  const maxNumberOfSteps = _(succesfulSteps).max() * 2;

  let successfulYVelocities = []
  for (let initialYVelocity = -100; initialYVelocity < 100; initialYVelocity++) {
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

  for (const yVelocity of _(successfulYVelocities).orderBy('maxHeight', 'desc').value()) {
    for (const xVelocity of successfulXVelocities) {
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
          xValues = _.reverse(xVelocity.xPositions)
        }
      } else {
        xValues = _.reverse(xVelocity.xPositions);
        yValues = _.take(yVelocity.yPositions, xValues.length);
      }
      const xyValues = _.zip(xValues, yValues)
      const firstTargetHit = xyValues.find(xy => target.withinX(xy[0]) && target.withinY(xy[1]));
      if (firstTargetHit) {
        const maxHeight = yVelocity.maxHeight;
        console.log({xDrops, lastX, secondLastX, xValues, yValues, firstTargetHit, maxHeight})
        return maxHeight;
      }
    }
  }

  // return 45;
}

const myInput = 'target area: x=143..177, y=-106..-71';

describe('Trick Shot', () => {
  describe('highest point', () => {
    test('aoc example ', function () {
      expect(highestPoint('target area: x=20..30, y=-10..-5')).toEqual(45)
    });
    test('my input ', function () {
      expect(highestPoint(myInput)).toBeGreaterThan(4950)
    });
  })
})