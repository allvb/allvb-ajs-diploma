import { getPositionsToAttack } from '../js/generators';

test('testing getPositionsToAttack', () => {
  const swordsman = getPositionsToAttack('swordsman', 9);
  expect([0, 1, 2, 8, 10, 16, 17, 18]).toEqual(swordsman);
  const undead = getPositionsToAttack('undead', 22);
  expect([13, 14, 15, 21, 23, 29, 30, 31]).toEqual(undead);
  const bowman = getPositionsToAttack('bowman', 9);
  expect([0, 1, 2, 3, 8, 10, 11, 16, 17, 18, 19, 24, 25, 26, 27]).toEqual(bowman);
  const vampire = getPositionsToAttack('vampire', 22);
  expect([4, 5, 6, 7, 12, 13, 14, 15, 20, 21, 23,
    28, 29, 30, 31, 36, 37, 38, 39]).toEqual(vampire);
  const magician = getPositionsToAttack('magician', 9);
  expect([0, 1, 2, 3, 4, 5, 8, 10, 11, 12, 13, 16,
    17, 18, 19, 20, 21, 24, 25, 26, 27, 28, 29,
    32, 33, 34, 35, 36, 37, 40, 41, 42, 43, 44, 45]).toEqual(magician);
  const daemon = getPositionsToAttack('magician', 22);
  expect([2, 3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15,
    18, 19, 20, 21, 23, 26, 27, 28, 29, 30, 31, 34,
    35, 36, 37, 38, 39, 42, 43, 44, 45, 46, 47, 50,
    51, 52, 53, 54, 55]).toEqual(daemon);
});
