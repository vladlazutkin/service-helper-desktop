import { isMobile } from '../../helpers/isMobile';

export const WIDTH = isMobile()
  ? window.innerWidth - 30
  : window.innerWidth / 2;
export const HEIGHT = isMobile()
  ? window.innerHeight - 100
  : window.innerHeight - 120;

export const VIEW_WIDTH = WIDTH;
export const VIEW_HEIGHT = HEIGHT;

export const PLATFORM_WIDTH = 140;
export const PLATFORM_HEIGHT = 20;

export const SPHERE_RADIUS = 15;

export const BLOCK_BORDER_WIDTH = 1;
