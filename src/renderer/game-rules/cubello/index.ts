import Game from './Game';
import { Player } from './Player';
import { Camera } from './Camera';
import { GameMap } from './Map';
import { HEIGHT, VIEW_HEIGHT, VIEW_WIDTH, WIDTH } from './constants';

export class CubelloGame {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: GameMap;
  player: Player;
  camera: Camera;
  interval: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.height = HEIGHT;
    this.canvas.width = WIDTH;
    this.canvas.style.borderRadius = '5px';
    this.initHandlers();

    this.player = new Player(200, VIEW_HEIGHT);
    this.map = new GameMap(VIEW_WIDTH, VIEW_HEIGHT);
    this.map.generate();

    const vWidth = Math.min(VIEW_WIDTH, WIDTH);
    const vHeight = Math.min(VIEW_HEIGHT, HEIGHT);

    this.camera = new Camera(0, 0, vWidth, vHeight, VIEW_WIDTH, VIEW_HEIGHT);
    this.camera.follow(this.player, vWidth / 2, vHeight / 2);

    const FPS = 60;
    const INTERVAL = 1000 / FPS;
    const STEP = INTERVAL / 1000;

    const update = () => {
      this.player.update(STEP, VIEW_WIDTH, VIEW_HEIGHT, this.map);
      this.camera.update();
    };
    const draw = () => {
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.ctx.fillStyle = '#484848';
      this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

      this.map.draw(this.ctx, this.camera.xView, this.camera.yView);
      this.player.draw(this.ctx, this.camera.xView, this.camera.yView);
    };

    const gameLoop = () => {
      update();
      draw();
    };
    this.interval = window.setInterval(() => gameLoop(), INTERVAL);
    this.test();
  }

  unmount() {
    clearInterval(this.interval);
  }

  async test() {
    // Game.controls.right = true;
    // Game.controls.up = true;
  }

  initHandlers() {
    window.addEventListener('touchstart', (event) => {
      if (event.targetTouches.length === 1) {
        this.player.jump();
      } else {
        this.player.jump(true);
      }
    });
    window.addEventListener(
      'keydown',
      (e) => {
        switch (e.keyCode) {
          case 37: // left arrow
            Game.controls.left = true;
            break;
          case 38: // up arrow
            Game.controls.up = true;
            break;
          case 39: // right arrow
            Game.controls.right = true;
            break;
          case 40: // down arrow
            Game.controls.down = true;
            break;
          case 32: // space
            if (e.shiftKey) {
              this.player.jump(true);
            } else {
              this.player.jump();
            }
            break;
        }
      },
      false
    );

    window.addEventListener(
      'keyup',
      function (e) {
        switch (e.keyCode) {
          case 37: // left arrow
            Game.controls.left = false;
            break;
          case 38: // up arrow
            Game.controls.up = false;
            break;
          case 39: // right arrow
            Game.controls.right = false;
            break;
          case 40: // down arrow
            Game.controls.down = false;
            break;
          case 32: // space
            Game.controls.space = false;
            break;
        }
      },
      false
    );
  }
}
