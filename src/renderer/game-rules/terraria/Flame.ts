import { getAngle } from './helpers/getAngle';
import EventEmitter from './game/EventEmitter';
import State from './game/State';
import Game from './game/Game';
import { OBJECT_TAG } from './constants';
import { Weapon } from './weapons/Weapon';
import { getDistance } from './helpers/getDistance';
import { addAlpha } from './helpers/addAlpha';
import { Object } from './game/Object';

class Particle {
  x: number;
  y: number;
  xs: number;
  ys: number;

  constructor(x: number, y: number, xs: number, ys: number) {
    this.x = x;
    this.y = y;
    this.xs = xs;
    this.ys = ys;
  }
}

export class Flame {
  x: number;
  y: number;

  fromX: number;
  fromY: number;
  toX: number;
  toY: number;

  from: OBJECT_TAG;
  weapon: Weapon;

  touched: Object[] = [];

  lifeTime: number;

  width = 650;
  height = 400;
  particles: Particle[] = [];

  speed = 200;
  size = 10;

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

    this.weapon = weapon;

    this.from = from;
    this.lifeTime = Date.now();

    const angle = getAngle(this.x, this.y, toX, toY);
    const vx = Math.cos(angle);
    const vy = Math.sin(angle);
    for (let i = 0; i < 50; i++) {
      const p = new Particle(
        fromX + vx * 30,
        fromY + vy * (Math.abs(vy) > 0.5 ? 40 : 30),
        vx * this.speed + (Math.random() - 0.5) * 100,
        vy * this.speed + (Math.random() - 0.5) * 100
      );
      this.particles.push(p);
    }
  }

  update() {
    const step = Game.step;

    for (let i = 0; i < this.particles.length; i++) {
      const distance = getDistance(
        this.fromX,
        this.particles[i].x,
        this.fromY,
        this.particles[i].y
      );
      if (distance > this.weapon.shootDistance) {
        this.particles.splice(i, 1);
        i--;
      }
    }
    if (Date.now() - this.lifeTime > 5000) {
      return EventEmitter.dispatch('bullet-die', this);
    }

    if (this.from === OBJECT_TAG.PLAYER) {
      State.getEnemies().forEach((enemy) => {
        if (
          this.particles.find((p) => enemy.intersects(p.x, p.y)) &&
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
      this.particles.find((p) => State.getPlayer().intersects(p.x, p.y))
    ) {
      const damage = this.randomizeDamage();
      const color =
        damage > this.weapon.damage * State.getPlayer().damageMultiplier
          ? '#ff0202'
          : '#d9e80f';
      State.getPlayer().takeDamage(damage, color);
      EventEmitter.dispatch('bullet-die', this);
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].x +=
        this.particles[i].xs * step + (Math.random() - 0.5) * 5;
      this.particles[i].y +=
        this.particles[i].ys * step + (Math.random() - 0.5) * 5;
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
    for (let i = 0; i < this.particles.length; i++) {
      const distance = getDistance(
        this.fromX,
        this.particles[i].x,
        this.fromY,
        this.particles[i].y
      );
      const percent = 1 - distance / this.weapon.shootDistance;
      ctx.fillStyle = addAlpha(this.weapon.color, 0.2 * percent);
      ctx.beginPath();
      ctx.arc(
        this.particles[i].x - xView,
        this.particles[i].y - yView,
        percent * (this.size / 2) + this.size / 2,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }
  }
}
