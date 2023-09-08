import Game from './game/Game';
import EventEmitter from './game/EventEmitter';
import { addAlpha } from './helpers/addAlpha';
import State from './game/State';

export class Particle {
  x: number;
  y: number;
  life: number = 1;
  text: string;
  color: string;
  speed: number = 100;
  vx: number;

  constructor(text: string, color: string, x: number, y: number) {
    this.text = text;
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = Math.random() - 0.5;
  }

  update() {
    const step = Game.step;
    this.y -= this.speed * step;
    this.x += this.vx;
    this.life -= 0.01;
    if (this.life <= 0) {
      EventEmitter.dispatch('particle-die', this);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (this.life <= 0.1) {
      return;
    }
    const { xView, yView } = State.getCamera();

    ctx.font = '24px serif';
    ctx.fillStyle = addAlpha(this.color, this.life);
    ctx.fillText(this.text, this.x - xView, this.y - yView);
  }
}
