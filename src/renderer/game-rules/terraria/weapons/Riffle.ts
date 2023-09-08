import { Bullet } from '../Bullet';
import EventEmitter from '../game/EventEmitter';
import { Object } from '../game/Object';
import { OBJECT_TAG, WEAPON_TAG } from '../constants';
import { Weapon } from './Weapon';

export class Riffle extends Weapon {
  constructor() {
    super(1000, 240, WEAPON_TAG.RIFFLE, Infinity);
  }

  shoot(object: Object, toX: number, toY: number, from: OBJECT_TAG) {
    if (!this.readyToShoot) {
      return;
    }
    const bullet = new Bullet(
      object.x + object.width / 2,
      object.y + object.height / 2,
      toX,
      toY,
      from,
      this
    );
    EventEmitter.dispatch('bullet-create', bullet);
    this.reload();
  }
}
