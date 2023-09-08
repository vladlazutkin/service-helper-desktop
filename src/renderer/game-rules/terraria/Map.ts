import { HEIGHT, TAG, VIEW_HEIGHT, VIEW_WIDTH, WIDTH } from './constants';
import State from './game/State';

const sprite = require('renderer/assets/images/games/terraria/sprites/Underworld 2.png');
const spriteGround = require('renderer/assets/images/games/terraria/sprites/ground.png');
const spriteStone = require('renderer/assets/images/games/terraria/sprites/stone.png');

const img = new Image();
img.src = sprite;

const ground = new Image();
ground.src = spriteGround;

const stone = new Image();
stone.src = spriteStone;

const spriteWidth = 24;
const spriteHeight = 24;

export class MapObjectBlock {
  x: number;
  y: number;
  width: number;
  height: number;
  src: HTMLImageElement;
  tag: TAG;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    src: HTMLImageElement,
    tag: TAG
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.src = src;
    this.tag = tag;
  }
}

export class GameMap {
  width: number;
  height: number;
  maps: MapObjectBlock[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  generate() {
    const maps: MapObjectBlock[] = [];

    let x = 0;
    // let toUp = true;
    // let count = 5 + Math.round(Math.random() * 3);
    // let current = 0;
    let y = VIEW_HEIGHT - HEIGHT / 2 + 100;
    while (x < VIEW_WIDTH) {
      // let y = 0;
      const to = 5;
      for (let i = 0; i < to; i++) {
        maps.push(
          new MapObjectBlock(
            x,
            VIEW_HEIGHT - i * 24,
            spriteWidth,
            spriteHeight,
            stone,
            TAG.GROUND
          )
        );
      }
      maps.push(
        new MapObjectBlock(
          x + 300,
          y,
          spriteWidth,
          spriteHeight,
          stone,
          TAG.PLATFORM
        )
      );
      maps.push(
        new MapObjectBlock(
          x + 300,
          y - 250,
          spriteWidth,
          spriteHeight,
          stone,
          TAG.PLATFORM
        )
      );

      x += 24;
      if (x % 240 === 0) {
        y -= 60;
      }
      // y += to;
      // const toGround = current * (toUp ? 1 : -1);
      // for (let i = y; i < toGround + y; i++) {
      //   maps.push(new MapObjectBlock(x, VIEW_HEIGHT - i * 24, ground));
      // }
      // x += 24;
      // count--;
      // current++;
      // if (count === 0) {
      //   count = 5 + Math.round(Math.random() * 3);
      //   current = 0;
      //   toUp = !toUp;
      // }
    }

    this.maps = maps;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { xView, yView } = State.getCamera();
    this.maps.forEach((rect) => {
      if (rect.x > WIDTH + xView || rect.x < xView - spriteWidth) {
        return;
      }
      ctx.drawImage(rect.src, rect.x - xView, rect.y - yView);
      // ctx.strokeStyle = 'red';
      // ctx.strokeRect(rect.x - xView, rect.y - yView, spriteWidth, spriteHeight);
    });
    // let x = 0;
    // while (x < VIEW_WIDTH) {
    //   ctx.drawImage(img, x - xView, -yView, WIDTH, HEIGHT);
    //   x += WIDTH - 1;
    // }
  }
}
