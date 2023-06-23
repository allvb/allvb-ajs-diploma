import { calcTileType } from '../js/utils';

test('testing calcTileType', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
  expect(calcTileType(5, 8)).toBe('top');
  expect(calcTileType(7, 8)).toBe('top-right');
  expect(calcTileType(56, 8)).toBe('bottom-left');
  expect(calcTileType(63, 8)).toBe('bottom-right');
  expect(calcTileType(60, 8)).toBe('bottom');
  expect(calcTileType(24, 8)).toBe('left');
  expect(calcTileType(39, 8)).toBe('right');
  expect(calcTileType(18, 8)).toBe('center');
  expect(calcTileType(42, 8)).toBe('center');
});
