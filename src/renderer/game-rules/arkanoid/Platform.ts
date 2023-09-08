import Game from './Game';
import { PLATFORM_HEIGHT, PLATFORM_WIDTH } from './constants';
import { isMobile } from '../../helpers/isMobile';

export class Platform {
  x: number;
  y: number;
  defaultCoors: { x: number; y: number };
  speed: number;
  width: number;
  height: number;
  isStarted: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.defaultCoors = { x, y };

    this.speed = isMobile() ? 300 : 500;

    this.width = PLATFORM_WIDTH;
    this.height = PLATFORM_HEIGHT;
  }

  reset() {
    this.x = this.defaultCoors.x;
    this.y = this.defaultCoors.y;
    this.isStarted = false;
  }

  start() {
    if (this.isStarted) {
      return;
    }
    this.isStarted = true;
  }

  update(step: number, worldWidth: number, worldHeight: number) {
    if (!this.isStarted) {
      return;
    }
    if (Game.controls.left) {
      this.x -= this.speed * step;
    }
    if (Game.controls.right) {
      this.x += this.speed * step;
    }

    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.x + this.width >= worldWidth) {
      this.x = worldWidth - this.width;
    }
    if (this.y + this.height >= worldHeight) {
      this.y = worldHeight - this.height;
    }
  }

  draw(context: CanvasRenderingContext2D, xView: number, yView: number) {
    context.fillStyle = '#ff7c7c';
    context.fillRect(this.x - xView, this.y - yView, this.width, this.height);
  }
}
