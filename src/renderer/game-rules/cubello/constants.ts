import { isMobile } from '../../helpers/isMobile';

export const WIDTH = isMobile()
  ? window.innerWidth - 30
  : Math.min(1200, window.innerWidth - 100);
export const HEIGHT = isMobile()
  ? window.innerHeight - 100
  : window.innerHeight - 120;

export const VIEW_WIDTH = WIDTH;
export const VIEW_HEIGHT = HEIGHT * 20;

export const CUBE_WIDTH = 50;
export const CUBE_HEIGHT = 50;

export const MAX_MAP_HEIGHT = HEIGHT / 2;
export const MIN_MAP_HEIGHT = HEIGHT / 10;
export const MAX_MAP_WIDTH = WIDTH / 2;
export const MIN_MAP_WIDTH = WIDTH / 10;
export const MAX_MAP_WIDTH_SPACE = WIDTH / 5;
export const MIN_MAP_WIDTH_SPACE = WIDTH / 10;
