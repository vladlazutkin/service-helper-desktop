import Game from './game/Game';
import { MapObjectBlock } from './Map';
import {
  OBJECT_TAG,
  TAG,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  WEAPON_TYPE,
} from './constants';
import EventEmitter from './game/EventEmitter';
import State from './game/State';
import { createImgSprite } from './helpers/createImgSprite';
import { Particle } from './Particle';
import { Object } from './game/Object';
import { BaseObject } from './game/interfaces/BaseObject';
import { LiveObject } from './game/interfaces/LiveObject';
import { Weapon } from './weapons/Weapon';
import { MeleeWeapon } from './weapons/MeleeWeapon';
import { Rectangle } from './game/Rectangle';
import { Drop } from './drops/Drop';
import { AddHpPercentDrop } from './drops/buffs/AddHpPercentDrop';
import { AddSpeedPercentDrop } from './drops/buffs/AddSpeedPercentDrop';
import { AddFireRatePercentDrop } from './drops/buffs/AddFireRatePercentDrop';
import { AddDamagePercentDrop } from './drops/buffs/AddDamagePercentDrop';

const sprite = require('renderer/assets/images/games/terraria/sprites/NPC_222.png');
const spriteDir = require('renderer/assets/images/games/terraria/sprites/imgonline-com-ua-Mirror-63iHSTj7ZEIebuG.png');

type IntersectionResult =
  | { collision: true; coors: { x: number; y: number }; side: string }
  | { collision: false };

const spriteWidth = 35;
const spriteHeight = 48;
const img = new Image();
img.src = sprite;
const imgDir = new Image();
imgDir.src = spriteDir;

const imgPlayer = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/PC Computer - Terraria - Angler.png')
);

export class Player extends Object implements BaseObject, LiveObject {
  speed: number;
  initialSpeed: number;
  jumpSpeed: number;
  goingDown: boolean = false;
  jumpY: number = 0;
  isJumping: boolean = false;
  isFalling: boolean = false;
  velocity: number = 1;
  jumpHeight: number = 150;
  fallSpeed: number;
  doubleJump: boolean = false;
  direction: 'left' | 'right' = 'right';
  gameFrame: number = 0;
  spriteAnimations: Record<string, { loc: { x: number; y: number }[] }> = {};

  weapon: Weapon | MeleeWeapon;
  fireRateMultiplier: number = 1;
  damageMultiplier: number = 1;

  HP: number = 0;
  totalHP: number = 0;
  isAlive = true;
  healing: boolean = false;
  healTimeout: number = -1;

  rect: Rectangle;

  constructor(x: number, y: number, weapon: Weapon | MeleeWeapon) {
    super(x, y, spriteWidth, spriteHeight);

    this.speed = 350;
    this.initialSpeed = this.speed;
    this.jumpSpeed = 800;
    this.fallSpeed = 400;
    this.fall();
    this.totalHP = 10000;
    this.HP = this.totalHP;
    this.weapon = weapon;

    this.rect = new Rectangle(this.x, this.y, this.width, this.height);

    this.initAnimations();
  }

  setWeapon(weapon: Weapon | MeleeWeapon) {
    this.weapon = weapon;
  }

  pickDrop(drop: Drop) {
    if (drop instanceof AddHpPercentDrop) {
      this.totalHP = Math.round(this.totalHP * (1 + drop.hpPercent / 100));
      this.HP = this.totalHP;
    } else if (drop instanceof AddSpeedPercentDrop) {
      this.speed = this.speed + (this.initialSpeed * drop.speedPercent) / 100;
    } else if (drop instanceof AddFireRatePercentDrop) {
      this.fireRateMultiplier =
        this.fireRateMultiplier * (1 + drop.fireRatePercent / 100);
    } else if (drop instanceof AddDamagePercentDrop) {
      this.damageMultiplier =
        this.damageMultiplier * (1 + drop.damagePercent / 100);
    }
  }

  initAnimations() {
    this.spriteAnimations['idle'] = {
      loc: [
        { x: 0, y: 10 },
        { x: 58, y: 10 },
      ],
    };
  }

  takeDamage(damage: number, color: string) {
    if (!this.isAlive) {
      return;
    }

    this.healing = false;
    clearTimeout(this.healTimeout);
    this.healTimeout = window.setTimeout(() => {
      this.healing = true;
    }, 2000);

    this.HP = Math.max(this.HP - damage, 0);
    if (this.HP === 0) {
      this.isAlive = false;
      EventEmitter.dispatch('player-die', this);
    }
    const particle = new Particle(
      damage.toString(),
      color,
      this.x + this.width,
      this.y
    );
    EventEmitter.dispatch('particle-create', particle);
  }

  getRect() {
    return this.rect;
  }

  copy() {
    return new Player(this.x, this.y, this.weapon);
  }

  jump() {
    if (this.isJumping) {
      if (this.doubleJump) {
        return;
      }
      this.doubleJump = true;
      this.jumpY = this.y;
      this.velocity = 1;
      this.goingDown = false;
      return;
    }
    this.jumpY = this.y;
    this.isJumping = true;
    this.isFalling = false;
    this.fallSpeed = this.jumpSpeed;
    this.velocity = 1;
    this.goingDown = false;
  }

  fall(smooth: boolean = false) {
    if (smooth) {
      this.fallSpeed = 100;
    }
    this.isFalling = true;
    this.goingDown = true;
  }

  checkIntersection(rect: MapObjectBlock): IntersectionResult {
    if (this.y + this.height > rect.y && this.y < rect.y + rect.height) {
      //From player left move to right collision
      if (
        this.x + this.width > rect.x &&
        rect.x + rect.width > this.x + this.width
      ) {
        return {
          collision: true,
          coors: {
            x: rect.x - this.width,
            y: this.y,
          },
          side: 'right',
        };
        //From player right move to left collision
      } else if (this.x < rect.x + rect.width && rect.x < this.x) {
        return {
          collision: true,
          coors: {
            x: rect.x + rect.width,
            y: this.y,
          },
          side: 'left',
        };
      }
    } else if (this.x < rect.x + rect.width && this.x + this.width > rect.x) {
      //From bottom jump to ceiling collision
      if (this.y < rect.y + rect.height && rect.y < this.y) {
        return {
          collision: true,
          coors: {
            x: this.x,
            y: rect.y + rect.height,
          },
          side: 'top',
        };
        //From top fall to rectangle floor collision
      } else if (
        this.y + this.height > rect.y &&
        rect.y + rect.height > this.y
      ) {
        return {
          collision: true,
          coors: {
            x: this.x,
            y: rect.y - this.height,
          },
          side: 'bottom',
        };
      }
    }
    return { collision: false };
  }

  shoot() {
    if (this.weapon.type === WEAPON_TYPE.MELEE) {
      (this.weapon as MeleeWeapon).beat(
        this,
        this.direction,
        OBJECT_TAG.PLAYER
      );
    } else {
      (this.weapon as Weapon).shoot(
        this,
        Game.state.mouse.x,
        Game.state.mouse.y,
        OBJECT_TAG.PLAYER
      );
    }
  }

  update() {
    if (this.healing) {
      this.HP = Math.min(this.HP + 0.05, this.totalHP);
    }
    const step = Game.step;
    const map = State.getMap();
    if (this.isJumping || this.isFalling) {
      if (!this.goingDown) {
        if (Math.abs(this.y - this.jumpY) < this.jumpHeight) {
          this.y -=
            ((this.isFalling ? this.fallSpeed : this.jumpSpeed) * step) /
            this.velocity;
          // this.x += this.isFalling
          //   ? 0
          //   : ((this.jumpSpeed * step) / 2 / this.velocity) *
          //     (this.direction === 'right' ? 1 : -1);
          this.velocity *= 1.05;
          this.velocity = Math.min(this.velocity, 5);
        } else {
          this.goingDown = true;
        }
      } else {
        this.y +=
          ((this.isFalling ? this.fallSpeed : this.jumpSpeed) * step) /
          this.velocity;
        // this.x += this.isFalling
        //   ? 0
        //   : ((this.jumpSpeed * step) / 2 / this.velocity) *
        //     (this.direction === 'right' ? 1 : -1);
        this.velocity /= 1.05;
        this.velocity = Math.max(this.velocity, 1);
        if (this.y + this.height >= VIEW_HEIGHT) {
          this.goingDown = false;
          this.isJumping = false;
          this.isFalling = false;
          this.fallSpeed = this.jumpSpeed;
          this.velocity = 1;
          this.doubleJump = false;
        }
      }
    }

    if (Game.controls.mouseDown) {
      this.shoot();
    }

    const copy = this.copy();
    if (Game.controls.left) {
      this.direction = 'left';
      copy.x -= this.speed * step;
    }
    if (Game.controls.up) {
      copy.y -= this.speed * step;
    }
    if (Game.controls.right) {
      this.direction = 'right';
      copy.x += this.speed * step;
    }
    if (Game.controls.down) {
      copy.y += this.speed * step;
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
      this.goingDown = false;
      this.isJumping = false;
      this.fallSpeed = this.jumpSpeed;
      this.velocity = 1;
      this.doubleJump = false;
      this.isFalling = false;
      return;
    }

    if (int && !Game.controls.down && !(this.isJumping && !this.goingDown)) {
      this.y = int.y - this.height;
      this.goingDown = false;
      this.isJumping = false;
      this.fallSpeed = this.jumpSpeed;
      this.velocity = 1;
      this.doubleJump = false;
      this.isFalling = false;
      return;
    }
    this.x = copy.x;
    this.y = copy.y;

    // function collide(r1: any, r2: any) {
    //   const dx = r1.x + r1.width - (r2.x + r2.width);
    //   const dy = r1.y + r1.height - (r2.y + r2.height);
    //   const width = (r1.width + r2.width) / 2;
    //   const height = (r1.height + r2.height) / 2;
    //   const crossWidth = width * dy;
    //   const crossHeight = height * dx;
    //   let collision = 'none';
    //   //
    //   if (Math.abs(dx) <= width && Math.abs(dy) <= height) {
    //     if (crossWidth > crossHeight) {
    //       collision = crossWidth > -crossHeight ? 'bottom' : 'left';
    //     } else {
    //       collision = crossWidth > -crossHeight ? 'right' : 'top';
    //     }
    //   }
    //   return collision;
    // }
    //
    // console.log(
    //   map.maps
    //     .map((m) => collide(map.maps[0], this))
    //     .filter((s) => s !== 'none')
    // );

    // const intRight = map.maps
    //   .map((block) => {
    //     // return (
    //     //   this.x + this.width > block.x && this.x + this.width - block.x < 10
    //     // );
    //     return collide(block, this);
    //   })
    //   .filter((c) => c !== 'none');
    //
    // if (intRight) {
    //   console.log(intRight);
    //   // this.x = intRight.x;
    // }
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
      !this.isJumping &&
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
    ctx.save();
    ctx.translate(this.x - xView, this.y - yView);
    if (this.direction === 'right') {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      imgPlayer,
      frameX,
      frameY,
      spriteWidth,
      spriteHeight,
      this.direction === 'right' ? -this.width : 0,
      0,
      spriteWidth,
      spriteHeight
    );
    ctx.restore();

    if (Game.debug) {
      ctx.strokeStyle = 'grey';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x - xView, this.y - yView, spriteWidth, spriteHeight);
    }

    this.weapon.draw(ctx);

    this.gameFrame++;
  }
}
