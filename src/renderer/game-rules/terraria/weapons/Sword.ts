import { Object } from '../game/Object';
import { OBJECT_TAG, WEAPON_TAG } from '../constants';
import { MeleeWeapon } from './MeleeWeapon';
import State from '../game/State';
import { Rectangle } from '../game/Rectangle';
import Game from '../game/Game';

export class Sword extends MeleeWeapon {
  animating: boolean = false;
  box: Rectangle | null = null;

  constructor() {
    super(500, 90, WEAPON_TAG.SWORD, 50);
  }

  beat(object: Object, direction: 'right' | 'left', from: OBJECT_TAG) {
    if (!this.readyToBeat) {
      return;
    }

    const enemies = State.getEnemies();
    const damageBox = new Rectangle(
      direction === 'right'
        ? object.x + object.width
        : object.x - this.distance,
      object.y,
      this.distance,
      object.height
    );
    this.box = damageBox;

    this.animating = true;
    setTimeout(() => {
      this.animating = false;
    }, 300);

    enemies.forEach((enemy) => {
      if (enemy.intersectsRect(damageBox)) {
        const damage = this.randomizeDamage();
        const color = damage > this.damage ? '#ff0202' : '#d9e80f';
        enemy.takeDamage(damage, color);
      }
    });

    this.reload();
  }

  randomizeDamage() {
    // 10%
    return Math.round((Math.random() - 0.5) * (this.damage / 20) + this.damage);
  }

  update() {}

  draw(ctx: CanvasRenderingContext2D) {
    if (this.animating && this.box) {
      if (Game.debug) {
        const { xView, yView } = State.getCamera();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 1;
        ctx.strokeRect(
          this.box.left - xView,
          this.box.top - yView,
          this.box.width,
          this.box.height
        );
      }
    }
  }
}
