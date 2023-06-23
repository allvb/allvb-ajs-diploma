import { getPositionsToMove } from '../js/generators';
import Bowman from '../js/characters/Bowman';

test('testing getPositionsToMove', () => {
  const char = {};
  char.character = new Bowman();
  char.position = 10;
  const characterList = [];
  characterList.push(char);
  const swordsman = getPositionsToMove('swordsman', 9, characterList);
  expect([0, 1, 2, 8, 11, 12, 13,
    16, 17, 18, 25, 27, 33, 36, 41, 45]).toEqual(swordsman);
  char.position = 13;
  const undead = getPositionsToMove('undead', 22, characterList);
  expect([4, 6, 14, 15, 18, 19, 20, 21, 23,
    29, 30, 31, 36, 38, 43, 46, 50, 54]).toEqual(undead);
  char.position = 10;
  const bowman = getPositionsToMove('bowman', 9, characterList);
  expect([0, 1, 2, 8, 11, 16, 17, 18, 25, 27]).toEqual(bowman);
  char.position = 13;
  const vampire = getPositionsToMove('vampire', 22, characterList);
  expect([4, 6, 14, 15, 20, 21, 23, 29, 30, 31, 36, 38]).toEqual(vampire);
  char.position = 10;
  const magician = getPositionsToMove('magician', 9, characterList);
  expect([0, 1, 2, 8, 16, 17, 18]).toEqual(magician);
  char.position = 13;
  const daemon = getPositionsToMove('daemon', 22, characterList);
  expect([14, 15, 21, 23, 29, 30, 31]).toEqual(daemon);
});
