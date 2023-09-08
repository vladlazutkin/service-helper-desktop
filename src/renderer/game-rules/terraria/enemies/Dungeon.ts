import Game from '../game/Game';
import { MapObjectBlock } from '../Map';
import { Particle } from '../Particle';
import { getDistance } from '../helpers/getDistance';
import EventEmitter from '../game/EventEmitter';
import State from '../game/State';
import { createImgSprite } from '../helpers/createImgSprite';
import {
  OBJECT_TAG,
  TAG,
  VIEW_HEIGHT,
  VIEW_WIDTH,
  WEAPON_TYPE,
} from '../constants';
import { BaseObject } from '../game/interfaces/BaseObject';
import { Object } from '../game/Object';
import { LiveObject } from '../game/interfaces/LiveObject';
import { Weapon } from '../weapons/Weapon';
import { EnemyRiffle } from '../weapons/EnemyRiffle';
import { MeleeWeapon } from '../weapons/MeleeWeapon';
import { EnemySword } from '../weapons/EnemySword';
import { AddHpPercentDrop } from '../drops/buffs/AddHpPercentDrop';
import { AddSpeedPercentDrop } from '../drops/buffs/AddSpeedPercentDrop';
import { AddFireRatePercentDrop } from '../drops/buffs/AddFireRatePercentDrop';
import { getRandomInteger } from '../../../helpers/getRandomInt';
import { AddDamagePercentDrop } from '../drops/buffs/AddDamagePercentDrop';

type IntersectionResult =
  | { collision: true; coors: { x: number; y: number }; side: string }
  | { collision: false };

const spriteWidth = 34;
const spriteHeight = 50;
const img = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/PC_Computer_-_Terraria_-_Dungeon-removebg-preview.png')
);

export class Dungeon extends Object implements BaseObject, LiveObject {
  speed: number;
  jumpSpeed: number;
  goingDown: boolean = false;
  jumpY: number = 0;
  isJumping: boolean = false;
  isFalling: boolean = false;
  velocity: number = 1;
  jumpHeight: number = 400;
  fallSpeed: number;
  doubleJump: boolean = false;
  direction: 'left' | 'right' = 'right';
  collisionTime = {
    left: 0,
    right: 0,
    top: 0,
  };
  isFollowingPlayer: boolean = false;
  gameFrame: number = 0;
  spriteAnimations: Record<string, { loc: { x: number; y: number }[] }> = {};

  totalHP: number;
  HP: number;
  isAlive = true;

  weapon: Weapon | MeleeWeapon;

  canFly: boolean = false;

  constructor(x: number, y: number, hp: number) {
    super(x, y, spriteWidth, spriteHeight);
    this.totalHP = hp;
    this.HP = hp;

    this.speed = 50;
    this.jumpSpeed = 800;
    this.fallSpeed = 800;
    this.weapon = new EnemyRiffle();
    // this.weapon = new EnemySword();
    this.initAnimations();
  }

  initAnimations() {
    this.spriteAnimations['idle'] = {
      loc: [
        { x: 230, y: 0 },
        { x: 264, y: 0 },
        // { x: 300, y: 0 },
        // { x: 334, y: 0 },
      ],
    };
  }

  copy() {
    return new Dungeon(this.x, this.y, this.HP);
  }

  shoot() {
    const player = State.getPlayer();
    if (!State.getPlayer().isAlive) {
      return;
    }
    if (this.weapon.type === WEAPON_TYPE.MELEE) {
      (this.weapon as MeleeWeapon).beat(this, this.direction, OBJECT_TAG.ENEMY);
    } else {
      (this.weapon as Weapon).shoot(
        this,
        player.x + player.width / 2,
        player.y + player.height / 2,
        OBJECT_TAG.ENEMY
      );
    }
  }

  jump() {
    if (this.isJumping) {
      // if (this.doubleJump) {
      //   return;
      // }
      // this.doubleJump = true;
      // this.jumpY = this.y;
      // this.velocity = 1;
      // this.goingDown = false;
      // if (changeDir) {
      //   this.direction = this.direction === 'right' ? 'left' : 'right';
      // }
      return;
    }
    this.jumpY = this.y;
    this.isJumping = true;
    this.isFalling = false;
    this.fallSpeed = this.jumpSpeed;
    this.velocity = 1;
    this.goingDown = false;
    this.collisionTime = {
      left: 0,
      right: 0,
      top: 0,
    };
  }

  fall(smooth: boolean = false) {
    if (smooth) {
      this.fallSpeed = 100;
    }
    this.isFalling = true;
    this.goingDown = true;
  }

  followPlayer() {
    this.isFollowingPlayer = true;
  }

  takeDamage(damage: number, color: string) {
    if (!this.isAlive) {
      return;
    }
    if (!this.isFollowingPlayer) {
      this.followPlayer();
    }
    this.HP = Math.max(this.HP - damage, 0);
    if (this.HP === 0) {
      const dropsList = [
        AddHpPercentDrop,
        AddSpeedPercentDrop,
        AddFireRatePercentDrop,
        AddDamagePercentDrop,
      ];
      const R = dropsList[getRandomInteger(0, dropsList.length - 1)];
      const drop = new R(this.x, this.y);
      EventEmitter.dispatch('drop-create', drop);
      EventEmitter.dispatch('enemy-die', this);
    }
    const particle = new Particle(
      damage.toString(),
      color,
      this.x + this.width,
      this.y
    );
    EventEmitter.dispatch('particle-create', particle);
  }

  checkIntersection(rect: MapObjectBlock): IntersectionResult {
    // if (this.y + this.height > rect.y && this.y < rect.y + rect.height) {
    //   //From player left move to right collision
    //   if (
    //     this.x + this.width > rect.x &&
    //     rect.x + rect.width > this.x + this.width
    //   ) {
    //     return {
    //       collision: true,
    //       coors: {
    //         x: rect.x - this.width,
    //         y: this.y,
    //       },
    //       side: 'right',
    //     };
    //     //From player right move to left collision
    //   } else if (this.x < rect.x + rect.width && rect.x < this.x) {
    //     return {
    //       collision: true,
    //       coors: {
    //         x: rect.x + rect.width,
    //         y: this.y,
    //       },
    //       side: 'left',
    //     };
    //   }
    // } else if (this.x < rect.x + rect.width && this.x + this.width > rect.x) {
    //   //From bottom jump to ceiling collision
    //   if (this.y < rect.y + rect.height && rect.y < this.y) {
    //     return {
    //       collision: true,
    //       coors: {
    //         x: this.x,
    //         y: rect.y + rect.height,
    //       },
    //       side: 'top',
    //     };
    //     //From top fall to rectangle floor collision
    //   } else if (
    //     this.y + this.height > rect.y &&
    //     rect.y + rect.height > this.y
    //   ) {
    //     return {
    //       collision: true,
    //       coors: {
    //         x: this.x,
    //         y: rect.y - this.height,
    //       },
    //       side: 'bottom',
    //     };
    //   }
    // }
    return { collision: false };
  }

  update() {
    if (this.isJumping || this.isFalling) {
      const step = Game.step;
      if (!this.goingDown) {
        if (Math.abs(this.y - this.jumpY) < this.jumpHeight) {
          this.y -=
            ((this.isFalling ? this.fallSpeed : this.jumpSpeed) * step) /
            this.velocity;
          this.velocity *= 1.05;
          this.velocity = Math.min(this.velocity, 5);
        } else {
          this.goingDown = true;
        }
      } else {
        this.y +=
          ((this.isFalling ? this.fallSpeed : this.jumpSpeed) * step) /
          this.velocity;
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

    if (this.isFollowingPlayer) {
      const player = State.getPlayer();
      const step = Game.step;
      const distance = getDistance(
        player.x + player.width / 2,
        this.x + this.width / 2,
        player.y + player.height / 2,
        this.y + this.height / 2
      );
      if (this.weapon.type === WEAPON_TYPE.DISTANCE) {
        if (distance < (this.weapon as Weapon).shootDistance) {
          return this.shoot();
        }
      } else {
        if (distance < 5000) {
          return this.shoot();
        }
      }

      if (
        Math.abs(player.x + player.width / 2 - (this.x + this.width / 2)) < 50
      ) {
        return;
        // if (player.y + player.height / 2 > this.y + this.height / 2) {
        //   this.fall();
        // } else {
        //   this.jump();
        // }
      }

      const delta =
        Math.sign(player.x + player.width / 2 - (this.x + this.width / 2)) *
        this.speed *
        step;
      this.direction = delta < 0 ? 'left' : 'right';
      this.x += delta;
      this.y +=
        Math.sign(player.y + player.height / 2 - (this.y + this.height / 2)) *
        this.speed *
        step;
    }
    if (!this.canFly) {
      const map = State.getMap();

      const int = map.maps.find((block) => {
        return (
          this.x + this.width > block.x &&
          this.x < block.x + block.width &&
          this.y + this.height > block.y &&
          this.y + this.height < block.y + block.height
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

      if (int && !(this.isJumping && !this.goingDown)) {
        this.y = int.y - this.height;
        this.goingDown = false;
        this.isJumping = false;
        this.fallSpeed = this.jumpSpeed;
        this.velocity = 1;
        this.doubleJump = false;
        this.isFalling = false;
        return;
      }

      const intActive = map.maps.find((block) => {
        return (
          this.y + this.height === block.y &&
          this.x + this.width > block.x &&
          this.x < block.x + block.width
        );
      });

      if (
        this.y + this.height !== VIEW_HEIGHT &&
        !this.isJumping &&
        !intActive
      ) {
        this.fall();
      }
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
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { xView, yView } = State.getCamera();
    const anim = this.spriteAnimations['idle'];
    const position = Math.floor(this.gameFrame / 20) % anim.loc.length;
    const frameX = anim.loc[position].x;
    const frameY = anim.loc[position].y;
    ctx.save();
    ctx.translate(this.x - xView, this.y - yView);
    if (this.direction === 'right') {
      ctx.scale(-1, 1);
    }
    ctx.drawImage(
      img,
      frameX,
      frameY,
      spriteWidth,
      spriteHeight,
      this.direction === 'right' ? -this.width : 0,
      0,
      this.width,
      this.height
    );
    ctx.restore();

    // HP
    ctx.fillStyle = 'red';
    ctx.fillStyle = 'rgba(255, 255, 255, .3)';
    ctx.fillRect(
      this.x - xView + this.width / 4,
      this.y - yView + this.height + 10,
      this.width / 2,
      5
    );
    ctx.fillStyle = 'rgb(0,161,44)';
    ctx.fillRect(
      this.x - xView + this.width / 4,
      this.y - yView + this.height + 10,
      (this.width / 2) * (this.HP / this.totalHP),
      5
    );
    if (Game.debug) {
      ctx.strokeStyle = 'grey';
      ctx.lineWidth = 1;
      ctx.strokeRect(this.x - xView, this.y - yView, this.width, this.height);
    }

    this.weapon.draw(ctx);
    this.gameFrame++;
  }
}
