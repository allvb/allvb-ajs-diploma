export default class GameState {
  constructor() {
    this.running = true;
    this.level = 1;
    this.turn = 'player';
    this.selectedCell = null;
    this.selectedCharacter = '';
  }

  changeTurn() {
    this.turn = this.turn === 'player' ? 'computer' : 'player';
  }
}
