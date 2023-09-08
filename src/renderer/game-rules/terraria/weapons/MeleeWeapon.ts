import { Object } from '../game/Object';
import { OBJECT_TAG, WEAPON_TAG, WEAPON_TYPE } from '../constants';
import { BaseObject } from '../game/interfaces/BaseObject';

export class MeleeWeapon implements BaseObject {
  damage: number;
  beatRate: number;
  readyToBeat: boolean = true;
  tag: WEAPON_TAG;
  distance: number;

  type: WEAPON_TYPE = WEAPON_TYPE.MELEE;

  constructor(
    damage: number,
    beatRate: number,
    tag: WEAPON_TAG,
    distance: number
  ) {
    this.damage = damage;
    this.beatRate = beatRate;
    this.tag = tag;
    this.distance = distance;
  }

  reload() {
    setTimeout(
      () => {
        this.readyToBeat = true;
      },
      (60 / this.beatRate) * 1000
    );
    this.readyToBeat = false;
  }

  beat(object: Object, direction: 'right' | 'left', from: OBJECT_TAG) {}

  update() {}

  draw(ctx: CanvasRenderingContext2D) {}
}
