export class Game {
  controls = {
    left: false,
    up: false,
    right: false,
    down: false,
  };

  isPressedAnyKey() {
    return Object.values(this.controls).find((v) => v);
  }
}

export default new Game();
