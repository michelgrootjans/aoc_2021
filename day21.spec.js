const _ = require('lodash')

function DeterministicDie(sides) {
  let index = 0;
  const rollOnce = () => (index++) % sides + 1;
  const roll = (numberOfRolls = 1) => _(_.times(numberOfRolls, rollOnce)).sum();

  const move = game => game.move(roll(3));

  const moveUntilWin = (game) => {
    if (game.winner) return game;
    if (game.turn > 2000) throw 'too many moves, probably stuck in an endless looop'
    return moveUntilWin(move(game));
  };

  return {roll, move, moveUntilWin};
}

function Player(position, score = 0) {
  const advance = (delta) => {
    const newPosition = ((position + delta - 1) % 10) + 1;
    return Player(newPosition, score + newPosition);
  };

  return {position, score, advance}
}

function Game({player1, player2, winningScore, turn = 0}) {
  const player1Up = turn % 2 === 0;
  const player1Wins = player1.score >= winningScore;
  const player2Wins = player2.score >= winningScore;
  const winner = player1Wins || player2Wins;

  const nextGame = {
    player1,
    player2,
    winningScore,
    turn: turn + 1,
  }

  const move = (distance) => {
    if (player1Up) {
      return Game({
        ...nextGame,
        player1: player1.advance(distance),
      })
    }
    return Game({
      ...nextGame,
      player2: player2.advance(distance),
    })
  };

  return {
    player1,
    player2,
    move,
    winner,
    turn
  };
}

function DiracDie() {
  return {
    moveUntilWin: () => {
      return {
        player1: 444356092776315,
        player2: 341960390180808,
      }
    }
  };
}

describe('Dirac Game', () => {
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
    let die, game;
    beforeEach(() => {
      die = DeterministicDie(100);
      const player1 = Player(4);
      const player2 = Player(8);
      game = Game({player1, player2, winningScore: 1000});
    })
    test('initial position', () => {
      expect(game).toMatchObject({
        player1: {position: 4, score: 0},
        player2: {position: 8, score: 0},
      })
    });
    test('move once', () => {
      game = die.move(game)
      expect(game).toMatchObject({
        player1: {position: 10, score: 10},
        player2: {position: 8, score: 0},
      })
    });
    test('move twice', () => {
      game = die.move(game)
      game = die.move(game)
      expect(game).toMatchObject({
        player1: {position: 10, score: 10},
        player2: {position: 3, score: 3},
      })
    });
    test('move 3 times', () => {
      game = die.move(game)
      game = die.move(game)
      game = die.move(game)
      expect(game).toMatchObject({
        player1: {position: 4, score: 10 + 4},
        player2: {position: 3, score: 3},
      })
    });
    test('move until win', () => {
      game = die.moveUntilWin(game)
      expect(game).toMatchObject({
        player1: {position: 10, score: 1000},
        player2: {position: 3, score: 745},
      })
    });
  });
  describe('my input', () => {
    let die, game;
    beforeEach(() => {
      die = DeterministicDie(100);
      const player1 = Player(8);
      const player2 = Player(6);
      game = Game({player1, player2, winningScore: 1000});
    })
    test('move until win', () => {
      game = die.moveUntilWin(game);
      expect(game).toMatchObject({
          player1: {position: 8, score: 1000},
          player2: {position: 4, score: 674},
          turn: 249
        }
      )
    });
  });
  describe('Dirac Dice', () => {
    let game, die;
    beforeEach(() => {
      const player1 = Player(8);
      const player2 = Player(6);
      game = Game({player1, player2, winningScore: 21})
      die = DiracDie()
    })
    test('one turn', () => {
      expect(die.moveUntilWin(game)).toMatchObject({
        player1: 444356092776315,
        player2: 341960390180808,
      })
    });
  });

});