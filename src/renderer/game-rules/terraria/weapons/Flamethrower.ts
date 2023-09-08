import { Weapon } from './Weapon';
import { Object } from '../game/Object';
import { OBJECT_TAG, WEAPON_TAG } from '../constants';
import EventEmitter from '../game/EventEmitter';
import { Flame } from '../Flame';

export class Flamethrower extends Weapon {
  constructor() {
    super(20, 5000, WEAPON_TAG.FLAMETHROWER, 100000, true);
    this.color = '#da9502';
  }

  shoot(object: Object, toX: number, toY: number, from: OBJECT_TAG) {
    if (!this.readyToShoot) {
      return;
    }
    const flame = new Flame(
      object.x + object.width / 2,
      object.y + object.height / 2,
      toX,
      toY,
      from,
      this
    );
    EventEmitter.dispatch('bullet-create', flame);
    this.reload();
  }
}
