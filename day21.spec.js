const _ = require('lodash')

function FixedDie(roll) {
  return {
    roll: (times = 1) => roll * times
  };
}

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
    advance,
    wins: score >= 1000
  }
}

function Game({die, player1, player2, turn = 0}) {
  const player1Up = () => turn % 2 === 0;
  const winner = () => player1.wins || player2.wins;

  const nextGame = {
    die,
    player1,
    player2,
    turn: turn + 1,
    player1Wins: player1.score >= 1000,
    player2Wins: player2.score >= 1000,
  }

  const move = (distance) => {
    if (player1Up()) {
      return Game({
        ...nextGame,
        player1: distance || player1.advance(die.roll(3)),
      })
    }
    return Game({
      ...nextGame,
      player2: distance || player2.advance(die.roll(3)),
    })
  };
  const moveUntilWin = () => {
    let game = move()
    let iterations = 0;
    while (!game.winner()) {
      iterations++;
      if (iterations > 1000) throw 'took too long'
      game = game.move();
    }
    return game;
  };
  return {
    player1,
    player2,
    move,
    moveUntilWin,
    winner,
    turn
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
        player2: {position: 8, score: 0},
      })
    });
    test('move twice', () => {
      expect(game.move().move()).toMatchObject({
        player1: {position: 10, score: 10},
        player2: {position: 3, score: 3},
      })
    });
    test('move 3 times', () => {
      expect(game.move().move().move()).toMatchObject({
        player1: {position: 4, score: 10 + 4},
        player2: {position: 3, score: 3},
      })
    });
    test('move until win', () => {
      expect(game.moveUntilWin()).toMatchObject({
        player1: {position: 10, score: 1000},
        player2: {position: 3, score: 745},
      })
    });
  });
  describe('my input', () => {
    let game;
    beforeEach(() => {
      const die = DeterministicDie(100);
      const player1 = Player(8);
      const player2 = Player(6);
      game = Game({die, player1, player2});
    })
    test('move until win', () => {
      expect(game.moveUntilWin()).toMatchObject({
          player1: {position: 8, score: 1000, wins: true},
          player2: {position: 4, score: 674, wins: false},
          turn: 249
        }
      )
    });
  });
  describe('Dirac Dice', () => {
    let game;
    beforeEach(() => {
      const player1 = Player(8);
      const player2 = Player(6);
    })
    test('one turn', () => {

    });
  });

});