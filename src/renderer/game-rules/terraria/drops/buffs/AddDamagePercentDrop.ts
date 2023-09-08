import Game from '../../game/Game';
import { DROP_TYPE, TAG, VIEW_HEIGHT, VIEW_WIDTH } from '../../constants';
import State from '../../game/State';
import { createImgSprite } from '../../helpers/createImgSprite';
import { Rectangle } from '../../game/Rectangle';
import EventEmitter from '../../game/EventEmitter';
import { Drop } from '../Drop';

const spriteWidth = 30;
const spriteHeight = 38;

const imgDrop = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/Extra_182.png')
);

export class AddDamagePercentDrop extends Drop {
  damagePercent: number = 10;

  constructor(x: number, y: number) {
    super(x, y, DROP_TYPE.DAMAGE);

    this.fall();
    this.initAnimations();
  }

  initAnimations() {
    this.spriteAnimations['idle'] = {
      loc: [
        { x: 150, y: 0 },
        { x: 240, y: 0 },
      ],
    };
  }

  getRect() {
    return new Rectangle(this.x, this.y, this.width, this.height);
  }

  fall() {
    this.isFalling = true;
  }

  update() {
    const step = Game.step;
    const map = State.getMap();
    const player = State.getPlayer();

    if (player.intersectsRect(this.getRect())) {
      player.pickDrop(this);
      EventEmitter.dispatch('drop-die', this);
    }

    if (this.isFalling) {
      this.y += (this.fallSpeed * step) / this.velocity;
      this.velocity /= 1.05;
      this.velocity = Math.max(this.velocity, 1);
      if (this.y + this.height >= VIEW_HEIGHT) {
        this.isFalling = false;
        this.velocity = 1;
      }
    }

    const int = map.maps.find((block) => {
      return (
        this.x + this.width > block.x &&
        this.x < block.x + block.width &&
        this.y + this.height > block.y &&
        this.y + this.height < block.y + block.height
      );
    });

    const intActive = map.maps.find((block) => {
      return (
        this.y + this.height === block.y &&
        this.x + this.width > block.x &&
        this.x < block.x + block.width
      );
    });

    if (int?.tag === TAG.GROUND) {
      this.y = int.y - this.height;
      this.velocity = 1;
      this.isFalling = false;
      return;
    }

    if (int) {
      this.y = int.y - this.height;
      this.velocity = 1;
      this.isFalling = false;
      return;
    }

    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.x + this.width >= VIEW_WIDTH) {
      this.x = VIEW_WIDTH - this.width;
    }
    if (this.y + this.height >= VIEW_HEIGHT) {
      this.y = VIEW_HEIGHT - this.height;
    }

    if (
      this.y + this.height !== VIEW_HEIGHT &&
      ((!intActive && !Game.controls.down) ||
        (Game.controls.down && intActive?.tag !== TAG.GROUND))
    ) {
      this.fall();
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { xView, yView } = State.getCamera();
    const anim = this.spriteAnimations['idle'];
    const position = Math.floor(this.gameFrame / 30) % anim.loc.length;
    const frameX = anim.loc[position].x;
    const frameY = anim.loc[position].y;
    ctx.drawImage(
      imgDrop,
      frameX,
      frameY,
      spriteWidth,
      spriteHeight,
      this.x - xView,
      this.y - yView,
      this.width,
      this.height
    );

    if (Game.debug) {
      ctx.strokeStyle = 'grey';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x - xView, this.y - yView, this.width, this.height);
    }

    this.gameFrame++;
  }
}
