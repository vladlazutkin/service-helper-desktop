import Game from './Game';
import { Sphere } from './Sphere';
import { Camera } from './Camera';
import { GameMap } from './Map';
import {
  HEIGHT,
  PLATFORM_WIDTH,
  SPHERE_RADIUS,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  WIDTH,
} from './constants';
import { Platform } from './Platform';

export class ArkanoidGame {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  map: GameMap;
  player: Sphere;
  platform: Platform;
  camera: Camera;
  interval: number;
  touchX: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.height = HEIGHT;
    this.canvas.width = WIDTH;
    this.canvas.style.borderRadius = '5px';
    this.initHandlers();

    this.player = new Sphere(VIEW_WIDTH / 2, VIEW_HEIGHT - 120);
    this.platform = new Platform(
      VIEW_WIDTH / 2 - PLATFORM_WIDTH / 2,
      VIEW_HEIGHT - (120 - SPHERE_RADIUS)
    );
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
      this.player.update(
        STEP,
        VIEW_WIDTH,
        VIEW_HEIGHT,
        this.map,
        this.platform
      );
      this.platform.update(STEP, VIEW_WIDTH, VIEW_HEIGHT);
      this.camera.update();
    };
    const draw = () => {
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.ctx.fillStyle = '#484848';
      this.ctx.fillRect(0, 0, WIDTH, HEIGHT);

      this.map.draw(this.ctx, this.camera.xView, this.camera.yView);
      this.player.draw(this.ctx, this.camera.xView, this.camera.yView);
      this.platform.draw(this.ctx, this.camera.xView, this.camera.yView);
    };

    const gameLoop = () => {
      update();
      draw();
    };
    this.interval = window.setInterval(() => gameLoop(), INTERVAL);
  }

  unmount() {
    clearInterval(this.interval);
  }

  initHandlers() {
    window.addEventListener('touchstart', (event) => {
      this.touchX = event.touches[0].clientX;
      this.player.start();
      this.platform.start();
    });
    window.addEventListener('touchmove', (event) => {
      const deltaX = event.touches[0].clientX - this.touchX;
      this.touchX = event.touches[0].clientX;
      if (deltaX > 0) {
        Game.controls.right = true;
        Game.controls.left = false;
      } else {
        Game.controls.left = true;
        Game.controls.right = false;
      }
    });
    window.addEventListener('touchend', () => {
      Game.controls.right = false;
      Game.controls.left = false;
    });
    window.addEventListener(
      'keydown',
      (e) => {
        switch (e.keyCode) {
          case 37: // left arrow
            Game.controls.left = true;
            break;
          case 39: // right arrow
            Game.controls.right = true;
            break;
          case 32: // space
            this.player.start();
            this.platform.start();
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
          case 39: // right arrow
            Game.controls.right = false;
            break;
        }
      },
      false
    );
  }
}
