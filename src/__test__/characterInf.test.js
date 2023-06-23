import GameController from '../js/GameController';
import GamePlay from '../js/GamePlay';
import Bowman from '../js/characters/Bowman';

const gamePlay = new GamePlay();
const gameController = new GameController(gamePlay, undefined);

test('characterTag', () => {
  const character = new Bowman(1);
  expect(gameController.characterInf(character)).toBe(`🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`);
});
