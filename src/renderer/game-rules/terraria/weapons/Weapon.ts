import { Object } from '../game/Object';
import { OBJECT_TAG, WEAPON_TAG, WEAPON_TYPE } from '../constants';
import { BaseObject } from '../game/interfaces/BaseObject';
import State from '../game/State';

export class Weapon implements BaseObject {
  damage: number;
  fireRate: number;
  readyToShoot: boolean = true;
  tag: WEAPON_TAG;
  shootDistance: number;
  cross: boolean;
  color = '#f60606';

  type: WEAPON_TYPE = WEAPON_TYPE.DISTANCE;

  constructor(
    damage: number,
    fireRate: number,
    tag: WEAPON_TAG,
    shootDistance: number,
    cross = false
  ) {
    this.damage = damage;
    this.fireRate = fireRate;
    this.tag = tag;
    this.shootDistance = shootDistance;
    this.cross = cross;
  }

  reload() {
    setTimeout(
      () => {
        this.readyToShoot = true;
      },
      (60 / (this.fireRate * State.getPlayer().fireRateMultiplier)) * 1000
    );
    this.readyToShoot = false;
  }

  shoot(object: Object, toX: number, toY: number, from: OBJECT_TAG) {}

  update() {}

  draw(ctx: CanvasRenderingContext2D) {}
}
