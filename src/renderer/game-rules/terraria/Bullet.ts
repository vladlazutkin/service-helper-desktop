import { getAngle } from './helpers/getAngle';
import EventEmitter from './game/EventEmitter';
import State from './game/State';
import Game from './game/Game';
import { OBJECT_TAG } from './constants';
import { Weapon } from './weapons/Weapon';
import { getDistance } from './helpers/getDistance';
import { addAlpha } from './helpers/addAlpha';
import { Object } from './game/Object';

export class Bullet {
  x: number;
  y: number;

  fromX: number;
  fromY: number;
  toX: number;
  toY: number;

  speed: number = 500;
  speedX: number = 520;

  tx: number;
  ty: number;
  vx: number;
  vy: number;

  from: OBJECT_TAG;
  weapon: Weapon;

  touched: Object[] = [];

  lifeTime: number;

  constructor(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    from: OBJECT_TAG,
    weapon: Weapon
  ) {
    this.fromX = fromX;
    this.fromY = fromY;
    this.toX = toX;
    this.toY = toY;
    this.x = fromX;
    this.y = fromY;

    this.tx = fromX;
    this.ty = fromY;

    this.weapon = weapon;

    this.from = from;
    const angle = getAngle(this.x, this.y, toX, toY);
    this.vx = Math.cos(angle);
    this.vy = Math.sin(angle);
    this.lifeTime = Date.now();
  }

  update() {
    const step = Game.step;
    this.x += this.vx * this.speed * step;
    this.y += this.vy * this.speed * step;

    this.tx += this.vx * this.speedX * step;
    this.ty += this.vy * this.speedX * step;

    const distance = getDistance(this.fromX, this.tx, this.fromY, this.ty);
    if (distance > this.weapon.shootDistance) {
      return EventEmitter.dispatch('bullet-die', this);
    }

    if (Date.now() - this.lifeTime > 5000) {
      return EventEmitter.dispatch('bullet-die', this);
    }
    if (this.from === OBJECT_TAG.PLAYER) {
      State.getEnemies().forEach((enemy) => {
        if (
          enemy.intersects(this.tx, this.ty) &&
          !this.touched.find((o) => o === enemy)
        ) {
          const damage = this.randomizeDamage();
          const color =
            damage > this.weapon.damage * State.getPlayer().damageMultiplier
              ? '#ff0202'
              : '#d9e80f';
          enemy.takeDamage(damage, color);
          if (!this.weapon.cross) {
            EventEmitter.dispatch('bullet-die', this);
          } else {
            this.touched.push(enemy);
          }
        }
      });
    }
    if (
      this.from === OBJECT_TAG.ENEMY &&
      State.getPlayer().intersects(this.tx, this.ty)
    ) {
      const damage = this.randomizeDamage();
      const color =
        damage > this.weapon.damage * State.getPlayer().damageMultiplier
          ? '#ff0202'
          : '#d9e80f';
      State.getPlayer().takeDamage(damage, color);
      EventEmitter.dispatch('bullet-die', this);
    }
  }

  randomizeDamage() {
    // 10%
    return Math.round(
      (Math.random() - 0.5) *
        ((this.weapon.damage * State.getPlayer().damageMultiplier) / 20) +
        this.weapon.damage * State.getPlayer().damageMultiplier
    );
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { xView, yView } = State.getCamera();
    ctx.beginPath();
    ctx.lineWidth = 5;
    const distance = getDistance(this.fromX, this.tx, this.fromY, this.ty);
    const percent = 1 - distance / this.weapon.shootDistance;
    if (percent < 0.03) {
      return;
    }
    ctx.strokeStyle = addAlpha(this.weapon.color, percent);
    ctx.moveTo(this.x - xView, this.y - yView);
    ctx.lineTo(this.tx - xView, this.ty - yView);
    ctx.stroke();
    ctx.closePath();
  }
}
