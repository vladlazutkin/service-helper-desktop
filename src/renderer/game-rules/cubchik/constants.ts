import { isMobile } from '../../helpers/isMobile';

export const WIDTH = isMobile()
  ? window.innerWidth - 30
  : Math.min(1200, window.innerWidth - 100);
export const HEIGHT = isMobile()
  ? window.innerHeight - 100
  : window.innerHeight - 120;

export const CUBE_SIZE = 4;
export const ROTATE_SPEED = 0.1;
