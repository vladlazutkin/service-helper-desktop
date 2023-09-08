class Game {
  controls = {
    space: false,
    left: false,
    up: false,
    right: false,
    down: false,
    cmd: false,
    mouseDown: false,
  };
  step = 0;
  state = {
    mouse: {
      x: 0,
      y: 0,
    },
  };
  debug: boolean = false;
}

export default new Game();
