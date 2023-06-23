import themes from './themes';
import cursor from './cursors';
import generateTeam from './generators';
import { generatePosition, getPositionsToAttack, getPositionsToMove } from './generators';
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';
import GameState from './GameState';
import GamePlay from './GamePlay';

export default class GameController {
  
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState();
    this.playerTeam = [];
    this.computerTeam = [];
    this.characterList = [];
  }

  init() { 
    this.startNewGame();
    // подпишем клетки на события мыши
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    // подпишем кнопки на нажатия
    this.gamePlay.addNewGameListener(this.startNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.saveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.loadGame.bind(this));
  }

  onCellClick(index) { // react to click
    if (this.gameState.running) { // если игра запущена
      // выбор персонажа на клетке
      const char = this.characterList.find(item => item.position === index);
      const positionToMove = getPositionsToMove(this.gameState.selectedCharacter, this.gameState.selectedCell, this.characterList);
      if (char) {
        const positionToAttack = getPositionsToAttack(this.gameState.selectedCharacter, this.gameState.selectedCell);
        if (char.character.type === 'bowman' ||
            char.character.type === 'swordsman' ||
            char.character.type === 'magician') {
              this.gamePlay.deselectCell(this.gameState.selectedCell);
              this.gamePlay.selectCell(index, 'yellow');
              this.gameState.selectedCharacter = char.character.type;
              this.gameState.selectedCell = index;
        } else if (positionToAttack.indexOf(index) >= 0) {
          let attacker = this.characterList.find(item => item.position === this.gameState.selectedCell).character;
          let target = char.character;
          let damage = Math.max((attacker.attack - target.defence) * 0.2, attacker.attack * 0.1);
          damage = Math.floor(damage);
          target.health -= damage;
          if (target.health < 1) {
            this.computerTeam.length -= 1;
            this.characterList = this.characterList.filter(item => item.position !== index);
          } 
          this.gamePlay.redrawPositions(this.characterList);
          if (this.computerTeam.length === 0) {
            if (this.gameState.level === 4) {
              this.gameState.running = false;
              GamePlay.showMessage('Победа');
              return;
            }
            this.gameState.level += 1;
            this.levelUp();
            this.gameState.selectedCell = null;
            this.gameState.selectedCharacter = '';
            this.startNextLevel();
          }
          this.gameState.running = false
          this.gamePlay.showDamage(index, damage).then(() => {
            setTimeout(() => {
              this.gameState.changeTurn();
              this.gameState.running = true;
              this.enemyTurn();
            }, 50);
          
          });
        }
        else {
          GamePlay.showError('Можно выделять только персонажей игрока');
        }
      } else if (positionToMove.indexOf(index) >= 0) {
        this.characterList.map(item => {
          if (item.position === this.gameState.selectedCell) {
            item.position = index;
            this.gamePlay.deselectCell(this.gameState.selectedCell);
            this.gameState.selectedCell = index;
            this.gamePlay.selectCell(index, 'yellow');
          }
        })
        this.gamePlay.redrawPositions(this.characterList);
        this.enemyTurn();
      } else { 
        GamePlay.showError('Пустая клетка');
      }
    }
  }

  onCellEnter(index) { // react to mouse 
    if (this.gameState.running) {
      const char = this.characterList.find(item => item.position === index);
      if (char) {
        this.gamePlay.setCursor(cursor.pointer);
        const message = this.characterInf(char.character);
        // `🎖️${char.character.level}⚔${char.character.attack}🛡${char.character.defence}❤${char.character.health}`;
        this.gamePlay.showCellTooltip(message, index);
        const positionsToAttack = getPositionsToAttack(this.gameState.selectedCharacter, this.gameState.selectedCell);
        if (char.character.type === 'undead' || 
            char.character.type === 'vampire' || 
            char.character.type === 'daemon') {
          if (positionsToAttack.indexOf(index) >= 0) {
            this.gamePlay.setCursor(cursor.crosshair);
          } else {
            this.gamePlay.setCursor(cursor.notallowed);
          }
        } 
      } else {
        const positionToMove = getPositionsToMove(this.gameState.selectedCharacter, this.gameState.selectedCell, this.characterList);
        if (positionToMove.indexOf(index) >= 0) {
          this.gamePlay.selectCell(index, 'green');
        }
      }
    }
  }

  onCellLeave(index) { // react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    this.gamePlay.setCursor(cursor.auto);
    if (index !== this.gameState.selectedCell) {
      this.gamePlay.deselectCell(index);
    }
  }

  startNewGame() { // старт новой игры
    this.clearAll();
    this.startNextLevel();
  }

  saveGame() { // сохраняем параметры игры
    const state = {};
    state.running = this.gameState.running;
    state.level = this.gameState.level;
    state.turn = this.gameState.turn;
    state.selectedCell = this.gameState.selectedCell;
    state.selectedCharacter = this.gameState.selectedCharacter;
    state.playerTeam = this.playerTeam;
    state.computerTeam = this.computerTeam;
    state.characterList = this.characterList;
    this.stateService.save(state);
    GamePlay.showMessage('Game is saved');
  }

  loadGame() { // загружаем сохранённую игру
    try {
      const state = this.stateService.load();
      this.gameState.running = state.running;
      this.gameState.level = state.level;
      this.gameState.turn = state.turn;
      this.gamePlay.deselectCell(this.gameState.selectedCell);
      this.gameState.selectedCell = state.selectedCell;
      if (this.gameState.selectedCell) {
        this.gamePlay.selectCell(this.gameState.selectedCell, 'yellow');
      }
      this.gameState.selectedCharacter = state.selectedCharacter;
      this.playerTeam = state.playerTeam;
      this.computerTeam = state.computerTeam;
      this.characterList = state.characterList;
      this.drawingPlan(this.gameState.level);
      this.gamePlay.redrawPositions(this.characterList);
      GamePlay.showMessage('Игра загружена');
    } 
    catch {
      GamePlay.showError('Нет сохранённой игры');
    }
  }

  clearAll() { // обновление параметров
    this.playerTeam = [];
    this.computerTeam = [];
    this.characterList = [];
    this.gameState.level = 1;
    this.gameState.running = true;
  }

  startNextLevel() { // старт нового уровня
    this.drawingPlan(this.gameState.level); // отрисуем поле
    this.generateNewTeam('player'); // создаём команду игрока
    this.generateNewTeam('computer'); // создаём команду компьютера
    this.positionTeam('player');
    this.positionTeam('computer');
    this.drawingCharacters();
  }

  drawingPlan(level) { // отрисовка поля
    let theme = '';
    if (level === 1) {
      theme = themes.prairie;
    }
    if (level === 2) {
      theme = themes.desert;
    }
    if (level === 3) {
      theme = themes.arctic;
    }
    if (level === 4) {
      theme = themes.mountain;
    }
    this.gamePlay.drawUi(theme);
  }

  generateNewTeam(player) { // создание команды
    if (player === 'player') {
      const arr = this.characterList.map(item => item); // временный массив
      this.playerTeam = [];
      for (let char of arr) {
        if (char.character.type === 'bowman' ||
            char.character.type === 'swordsman' ||
            char.character.type === 'magician') {
              this.playerTeam.push(char.character);
              this.characterList.shift();
        }
      }
      const number = 4 - this.playerTeam.length;
      if (number) {
        const team = generateTeam(['Bowman', 'Swordsman', 'Magician'], 1, number);
        this.playerTeam = this.playerTeam.concat(...team);
      }
    }
    if (player === 'computer') {
      const arr = this.characterList; // временный массив
      this.computerTeam = [];
      for (let char of arr) {
        if (char.character.type === 'undead' ||
            char.character.type === 'vampire' ||
            char.character.type === 'daemon') {
              this.computerTeam.push(char.character);
              this.characterList.shift();
        }
      }
      const number = 4 - this.computerTeam.length;
      if (number) {
        const team = generateTeam(['Undead', 'Daemon', 'Vampire'], 1, number);
        this.computerTeam = this.computerTeam.concat(team);
      }
    }
  }

  positionTeam(player) { // расстановка команды
    const team = player === 'player' ? this.playerTeam : this.computerTeam;
    const usedPositions = []; // массив занятых позиций
    for (let char of team) {
      // сгенерируем случайную позицию
      const position = generatePosition(player, usedPositions);
      // положим эту позицию в массив занятых позиций
      usedPositions.push(position);
      // создадим объект типа PositionedCharacter и положим его в массив
      const positionedCharacter = new PositionedCharacter(char, position);
      this.characterList.push(positionedCharacter);
    }
  }

  drawingCharacters() { // отрисовка персонажей
    this.gamePlay.redrawPositions(this.characterList);
  }

  levelUp() {
    let i = 0;
    for (let item of this.characterList) {
      const char = item.character;
      char.level += 1;
      char.attack = Math.max(char.attack, char.attack * (80 + char.health) / 100);
      char.attack = Math.floor(char.attack);
      char.defence = Math.max(char.defence, char.defence * (80 + char.health) / 100);
      char.defence = Math.floor(char.defence);
      char.health = char.health + 80 <= 100 ? char.health + 80 : 100;
      item.character = char;
      this.characterList[i] = item;
      i++;
    }
  }

  characterInf(character) {
    return `🎖${character.level} ⚔${character.attack} 🛡${character.defence} ❤${character.health}`;
  }

  enemyTurn() { // ход компьютера
    const playerTeam = [];
    const computerTeam = [];
    let maxDamage = {
      damage: 0
    };
    for (let char of this.characterList) {
      if (char.character.type === 'bowman' ||
          char.character.type === 'swordsman' ||
          char.character.type === 'magician') {
            playerTeam.push(char);
      }
      if (char.character.type === 'undead' ||
          char.character.type === 'vampire' ||
          char.character.type === 'daemon') {
            const attacker = char.character;
            const attackerPosition = char.position;
            computerTeam.push(char);
            const positionsToAttack = getPositionsToAttack(char.character.type, char.position);
            for (let char of playerTeam) {
              if (positionsToAttack.indexOf(char.position) >= 0) {
                let target = char.character;
                let damage = Math.max((attacker.attack - target.defence) * 0.2, attacker.attack * 0.1);
                damage = Math.floor(damage);
                if (damage > maxDamage.damage) {
                  maxDamage.damage = damage;
                  maxDamage.attackerPosition = attackerPosition;
                  maxDamage.defenderPosition = char.position;
                }
              }
            }
      }
    }
    if (maxDamage.damage > 0) {
      const target = this.characterList.find(item => item.position === maxDamage.defenderPosition);
      target.character.health -= maxDamage.damage;
      if (target.character.health < 1) {
        this.gameState.selectedCell = null;
        this.gameState.selectedCharacter = '';
        this.gamePlay.deselectCell(target.position);
        this.playerTeam.length -= 1;
        this.characterList = this.characterList.filter(item => item.position !== target.position);
      }
      this.gameState.running = false;
      this.gamePlay.showDamage(target.position, maxDamage.damage).then(() => 
      setTimeout(() => {
        this.gameState.running = true;
        this.gameState.changeTurn();
        this.gamePlay.redrawPositions(this.characterList);
      }, 100));
     
      // this.gamePlay.deselectCell(this.gameState.selectedCell);
      // this.gameState.selectedCell = 64;
      if(playerTeam.length = 0) {
        this.startNextLevel();
      }
      return;
    }  
    let rnd = Math.floor(Math.random() * this.computerTeam.length);
    const char = computerTeam[rnd];
    const positionsToMove = getPositionsToMove(char.character.type, char.position, this.characterList);
    rnd = Math.floor(Math.random() * positionsToMove.length);
    char.position = positionsToMove[rnd];
    this.gamePlay.redrawPositions(this.characterList);
    console.log(positionsToMove);

  }
}
