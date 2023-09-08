import { Bullet } from '../Bullet';
import EventEmitter from '../game/EventEmitter';
import { Object } from '../game/Object';
import { OBJECT_TAG, WEAPON_TAG } from '../constants';
import { Weapon } from './Weapon';

export class Shotgun extends Weapon {
  constructor() {
    super(500, 60, WEAPON_TAG.SHOTGUN, 100000);
  }

  shoot(object: Object, toX: number, toY: number, from: OBJECT_TAG) {
    if (!this.readyToShoot) {
      return;
    }
    [-10, -5, 0, 5, 10].map((value) => {
      const bullet = new Bullet(
        object.x + object.width / 2,
        object.y + object.height / 2 + value,
        toX,
        toY + value,
        from,
        this
      );
      EventEmitter.dispatch('bullet-create', bullet);
    });
    this.reload();
  }
}
