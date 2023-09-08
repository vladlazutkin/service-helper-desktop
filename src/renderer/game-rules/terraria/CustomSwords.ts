import { Enemy } from './enemies/Enemy';
import State from './game/State';

const sprite = require('renderer/assets/images/games/terraria/sprites/sword.png');
const sprite30 = require('renderer/assets/images/games/terraria/sprites/sword30.png');
const sprite60 = require('renderer/assets/images/games/terraria/sprites/sword60.png');

const spriteWidth = 32;
const spriteHeight = 32;
const img = new Image();
img.src = sprite;
const img30 = new Image();
img30.src = sprite30;
const img60 = new Image();
img60.src = sprite60;

export class CustomSwords {
  x: number;
  y: number;
  width: number;
  height: number;
  gameFrame: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.width = spriteWidth;
    this.height = spriteHeight;
  }

  update(x: number, y: number) {
    // const sorted = enemies
    //   .map((e) => ({
    //     distance: Math.pow(e.x - this.x, 2) + Math.pow(e.y - this.y, 2),
    //     enemy: e,
    //   }))
    //   .sort((a, b) => a.distance - b.distance);
    // if (sorted.length) {
    //   const { enemy } = sorted[0];
    //   this.x = enemy.x;
    //   this.y = enemy.y;
    // }
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { xView, yView } = State.getCamera();
    const deltaX = 0; //(Math.floor(this.gameFrame / 5) % 5) * -1;
    const deltaY = 0; //Math.floor(this.gameFrame / 5) % 5;
    const position = Math.floor(this.gameFrame / 10) % 2;
    Array.from({ length: 1 }).forEach((_, index) => {
      ctx.drawImage(
        position === 0 ? img : img30,
        0,
        0,
        spriteWidth,
        spriteHeight,
        this.x -
          xView -
          spriteWidth / 2 +
          deltaX +
          index * 20 -
          (position * spriteWidth) / 2,
        this.y - yView - spriteHeight / 2 + deltaY + index * 30,
        spriteWidth,
        spriteHeight
      );
    });

    this.gameFrame++;
  }
}
