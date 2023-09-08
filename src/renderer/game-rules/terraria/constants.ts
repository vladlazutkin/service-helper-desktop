import { isMobile } from '../../helpers/isMobile';

export const WIDTH = isMobile()
  ? window.innerWidth - 10
  : window.innerWidth - 60;
export const HEIGHT = isMobile()
  ? window.innerHeight - 100
  : window.innerHeight - 120;

export const VIEW_WIDTH = WIDTH * 20;
export const VIEW_HEIGHT = HEIGHT * 5;

export enum TAG {
  GROUND = 'GROUND',
  PLATFORM = 'PLATFORM',
}

export enum OBJECT_TAG {
  PLAYER = 'PLAYER',
  ENEMY = 'ENEMY',
}

export enum WEAPON_TAG {
  RIFFLE = 'RIFFLE',
  SHOTGUN = 'SHOTGUN',
  FLAMETHROWER = 'FLAMETHROWER',
  SWORD = 'SWORD',
}

export enum WEAPON_TYPE {
  MELEE = 'MELEE',
  DISTANCE = 'DISTANCE',
}

export enum DROP_TYPE {
  HP = 'HP',
  SPEED = 'SPEED',
  FIRE_RATE = 'FIRE_RATE',
  DAMAGE = 'DAMAGE',
}
