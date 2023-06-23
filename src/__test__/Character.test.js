import Character from '../js/Character';
import Bowman from '../js/characters/Bowman';
import Swordsman from '../js/characters/Swordsman';

test('testing Character to throw Error', () => {
  expect(() => {
    const character = new Character(1);
  }).toThrow('Нельзя напрямую вызывать класс Character');
});

test('testing class Bowman', () => {
  const bowman = new Bowman(1, 'Bowman');
  const example = {
    level: 1,
    attack: 25,
    defence: 25,
    health: 50,
    type: 'Bowman',
  };
  expect(bowman).toEqual(example);
});

test('testing class Swordsman', () => {
  const swordsman = new Swordsman(1, 'Swordsman');
  const example = {
    level: 1,
    attack: 40,
    defence: 10,
    health: 50,
    type: 'Swordsman',
  };
  expect(swordsman).toEqual(example);
});
