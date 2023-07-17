import Bowman from './characters/Bowman';
import Swordsman from './characters/Swordsman';
import Magician from './characters/Magician';
import Undead from './characters/Undead';
import Daemon from './characters/Daemon';
import Vampire from './characters/Vampire';

/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  const rndInd = Math.floor(Math.random() * allowedTypes.length);
  const rndLvl = Math.floor(Math.random() * maxLevel) + 1;
  const typeOfCharacter = allowedTypes[rndInd];
  if (typeOfCharacter === 'Bowman') {
    yield new Bowman(rndLvl, 'bowman');
  }

  if (typeOfCharacter === 'Swordsman') {
    yield new Swordsman(rndLvl, 'swordsman');
  }

  if (typeOfCharacter === 'Magician') {
    yield new Magician(rndLvl, 'magician');
  }

  if (typeOfCharacter === 'Undead') {
    yield new Undead(rndLvl, 'undead');
  }

  if (typeOfCharacter === 'Daemon') {
    yield new Daemon(rndLvl, 'daemon');
  }

  if (typeOfCharacter === 'Vampire') {
    yield new Vampire(rndLvl, 'vampire');
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export default function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const characters = [];
  for (let i = 0; i < characterCount; i += 1) {
    characters.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return characters;
}

/**
 * Функция получение случайной позиции
 * @param параметр принадлежности к команде игрока или компьютера
 * @usedPositions массив занятых позиций
 * Возвращает случайную позицию
 * Не должно быть совпадений позиций у персонажей
 */
export function generatePosition(player, usedPositions) {
  let index = 0; // участвует в изначальной расстановке команд
  const allowedPositions = []; // массив разрешённых позиций

  if (player !== 'player' && player !== 'computer') {
    throw new Error('Параметр передаваемый в функцию generatePosition() должен быть "Player" либо "Computer"');
  }
  if (player === 'player') {
    index = 0;
  }
  if (player === 'computer') {
    index = 6;
  }

  for (let i = 0; i < 8; i += 1) {
    if (!usedPositions.includes((i * 8) + index)) {
      allowedPositions.push((i * 8) + index);
    }
    if (!usedPositions.includes((i * 8) + index + 1)) {
      allowedPositions.push((i * 8) + index + 1);
    }
  }
  const randomPozition = Math.floor(Math.random() * allowedPositions.length);
  return allowedPositions[randomPozition];
}

/**
 * Функция получения позиций для атаки
 * @range параметр дальности атаки персонажа
 * @index позиция выбранного персонажа
 * Возвращает массив возможных позиций для атаки
 */
function getAttackRange(range, index) {
  const rangeList = [];
  const limitRow = [];
  const limitColumn = [];
  let position;

  // ограничение справа и слева
  for (let i = (index % 8) - range; i <= (index % 8) + range; i += 1) {
    if (i >= 0 && i < 8) {
      limitRow.push(i);
    }
  }

  // ограничение снузу и сверху
  for (let i = Math.floor(index / 8) - range; i <= Math.floor(index / 8) + range; i += 1) {
    if (i >= 0 && i < 8) {
      limitColumn.push(i);
    }
  }

  for (let i = -range; i < range + 1; i += 1) {
    for (let j = -range; j < range + 1; j += 1) {
      position = index + i * 8 + j;
      if (position !== index // исключение позиции выбранного персонажа
      && !rangeList.includes(position) // исключение повторяющихся значений
      && position >= 0 // ограничение сверху поля
      && position < 64 // ограничение снизу поля
      && limitRow.indexOf(position % 8) >= 0 // ограничение слева и справа
      && limitColumn.indexOf(Math.floor(position / 8)) >= 0) { // ограничение сверху и снизу
        rangeList.push(position);
      }
    }
  }
  return rangeList;
}

/**
 * Функция получения позиций для атаки
 * @char параметр персонажа
 * @index позиция выбранного персонажа
 * Возвращает массив возможных позиций для атаки
 */
export function getPositionsToAttack(char, index) {
  let positionsToAttack = [];
  if (char === 'swordsman' || char === 'undead') {
    positionsToAttack = getAttackRange(1, index);
  }
  if (char === 'bowman' || char === 'vampire') {
    positionsToAttack = getAttackRange(2, index);
  }
  if (char === 'magician' || char === 'daemon') {
    positionsToAttack = getAttackRange(4, index);
  }
  return positionsToAttack;
}

/**
 * Функция получения позиций для хода
 * @range параметр дальности атаки персонажа
 * @index позиция выбранного персонажа
 * @characterList  массив занятых позиций
 * Возвращает массив возможных позиций для хода
 */
function getMoveRange(range, index, characterList) {
  const usedPositions = characterList.map((item) => item.position);
  const rangeList = [];
  const limitRow = [];
  const limitColumn = [];
  let position = 0;

  // ограничение справа и слева
  for (let i = (index % 8) - range; i <= (index % 8) + range; i += 1) {
    if (i >= 0 && i < 8) {
      limitRow.push(i);
    }
  }

  // ограничение снузу и сверху
  for (let i = Math.floor(index / 8) - range; i <= Math.floor(index / 8) + range; i += 1) {
    if (i >= 0 && i < 8) {
      limitColumn.push(i);
    }
  }

  for (let i = -range; i < range + 1; i += 1) {
    const x = i === 0 ? range : Math.abs(i);
    const y = i === 0 ? 1 : Math.abs(i);
    for (let j = -x; j < x + 1; j += y) {
      position = index + i * 8 + j;
      if (position !== index // исключение позиции выбранного персонажа
      && !usedPositions.includes(position) // исключение занятого поля
      && Math.floor(position / 8) === Math.floor(index / 8) + i
      && position >= 0 // ограничение сверху поля
      && position < 64 // ограничение снизу поля
      // && position >= index - (range * 8) - range
      // && position <= index + (range * 8) + range
      && limitRow.indexOf(position % 8) >= 0 // ограничение слева и справа
      && limitColumn.indexOf(Math.floor(position / 8)) >= 0) { // ограничение сверху и снизу
      // && limit.indexOf(position % 8) >= 0) { // ограничение слева и справа поля
        rangeList.push(position);
      }
    }
  }
  return rangeList;
}

export function getPositionsToMove(char, index, characterList) {
  let positionsToMove = [];
  if (char === 'swordsman' || char === 'undead') {
    positionsToMove = getMoveRange(4, index, characterList);
  }
  if (char === 'bowman' || char === 'vampire') {
    positionsToMove = getMoveRange(2, index, characterList);
  }
  if (char === 'magician' || char === 'daemon') {
    positionsToMove = getMoveRange(1, index, characterList);
  }
  return positionsToMove;
}

export function createCharacter(level, type) {
  if (type === 'bowman') {
    return new Bowman(level, 'bowman');
  }
  if (type === 'swordsman') {
    return new Swordsman(level, 'swordsman');
  }
  if (type === 'magician') {
    return new Magician(level, 'magician');
  }
  if (type === 'undead') {
    return new Undead(level, 'undead');
  }
  if (type === 'vampire') {
    return new Vampire(level, 'vampire');
  }
  if (type === 'daemon') {
    return new Daemon(level, 'daemon');
  }
}
