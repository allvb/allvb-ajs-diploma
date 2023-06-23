import generateTeam, { characterGenerator } from '../js/generators';

test('testing characterGenerator', () => {
  expect.assertions(2);
  const allowedTypes = ['Bowman', 'Swordsman', 'Magician'];
  const generator = characterGenerator(allowedTypes, 4);
  const item = generator.next().value;
  expect([1, 2, 3, 4]).toContain(item.level);
  expect(['bowman', 'swordsman', 'magician']).toContain(item.type);
});

test('testing generateTeam', () => {
  expect.assertions(2);
  let allowedTypes = ['Bowman', 'Swordsman', 'Magician'];
  let team = generateTeam(allowedTypes, 4, 3);
  expect(team.length).toBe(3);
  allowedTypes = ['Vampire', 'Undead', 'Daemon'];
  team = generateTeam(allowedTypes, 4, 9);
  expect(team.length).toBe(9);
});
