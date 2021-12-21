const _ = require('lodash')

function DeterministicDie(sides) {
  let index = 0;
  const rollOnce = () => (index++) % sides + 1;

  return {
    roll: (times = 1) => _(_.range(times)).map(rollOnce).sum()
  };
}

function Player(position, score = 0) {
  const advance = (delta) => {
    const newPosition = ((position + delta - 1) % 10) + 1;
    return Player(newPosition, score + newPosition);
  };

  return {
    position,
    score,
    advance
  }
}

function Game({die, player1, player2}) {
  const move = () => {
    let newPlayer1 = player1.advance(die.roll(3));
    let newPlayer2 = player2.advance(die.roll(3));
    return Game({
      die,
      player1: newPlayer1,
      player2: newPlayer2,
    })
  };
  return {
    player1,
    player2,
    move
  };
}

describe('Dirac Dice', () => {
  describe('deterministic dice', () => {
    test('6-sided die', function () {
      const die = DeterministicDie(6);
      const rolls = _.range(12).map(() => die.roll());
      expect(rolls).toMatchObject([1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6])
    });
    test('roll 3 times', () => {
      const die = DeterministicDie(6);
      expect(die.roll(3)).toBe(1 + 2 + 3);
      expect(die.roll(3)).toBe(4 + 5 + 6);
      expect(die.roll(3)).toBe(1 + 2 + 3);
      expect(die.roll(3)).toBe(4 + 5 + 6);
    });
  });
  describe('aoc example', () => {
    let game;
    beforeEach(() => {
      const die = DeterministicDie(100);
      const player1 = Player(4);
      const player2 = Player(8);
      game = Game({die, player1, player2});
    })
    test('initial position', () => {
      expect(game).toMatchObject({
        player1: {position: 4, score: 0},
        player2: {position: 8, score: 0},
      })
    });
    test('move once', () => {
      expect(game.move()).toMatchObject({
        player1: {position: 10, score: 10},
        player2: {position: 3, score: 3},})
    });
    test('move twice', () => {
      expect(game.move().move()).toMatchObject({
        player1: {position: 4, score: 10 + 4},
        player2: {position: 6, score: 3 + 6},})
    });
    test('move 3 times', () => {
      expect(game.move().move().move()).toMatchObject({
        player1: {position: 6, score: 10 + 4 + 6},
        player2: {position: 7, score: 3 + 6 + 7},})
    });
  });
});