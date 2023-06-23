/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level, type) {
    this.level = level;
    this.attack = 0;
    this.defence = 0;
    this.health = 50;
    this.type = type;
    // TODO: выбросите исключение, если кто-то использует "new Character()"
    if (new.target.name !== 'Bowman'
        && new.target.name !== 'Swordsman'
        && new.target.name !== 'Magician'
        && new.target.name !== 'Vampire'
        && new.target.name !== 'Undead'
        && new.target.name !== 'Daemon') {
      throw new Error('Нельзя напрямую вызывать класс Character');
    }
  }
}
