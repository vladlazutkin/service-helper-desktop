import { Rectangle } from './Rectangle';
import { Sphere } from './Sphere';

const AXIS = {
  NONE: 1,
  HORIZONTAL: 2,
  VERTICAL: 3,
  BOTH: 4,
};

export class Camera {
  xView: number;
  yView: number;
  xDeadZone: number;
  yDeadZone: number;
  wView: number;
  hView: number;
  axis: number;
  followed: Sphere | null;
  viewportRect: Rectangle;
  worldRect: Rectangle;

  constructor(
    xView: number,
    yView: number,
    viewportWidth: number,
    viewportHeight: number,
    worldWidth: number,
    worldHeight: number
  ) {
    this.xView = xView || 0;
    this.yView = yView || 0;
    this.xDeadZone = 0; // min distance to horizontal borders
    this.yDeadZone = 0;
    this.wView = viewportWidth;
    this.hView = viewportHeight;

    // allow camera to move in vertical and horizontal axis
    this.axis = AXIS.BOTH;

    // object that should be followed
    this.followed = null;

    this.viewportRect = new Rectangle(
      this.xView,
      this.yView,
      this.wView,
      this.hView
    );

    // rectangle that represents the world's boundary (room's boundary)
    this.worldRect = new Rectangle(0, 0, worldWidth, worldHeight);
  }

  follow(gameObject: Sphere, xDeadZone: number, yDeadZone: number) {
    this.followed = gameObject;
    this.xDeadZone = xDeadZone;
    this.yDeadZone = yDeadZone;
  }

  update() {
    if (this.followed != null) {
      if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
        // moves camera on horizontal axis based on followed object position
        if (this.followed.x - this.xView + this.xDeadZone > this.wView)
          this.xView = this.followed.x - (this.wView - this.xDeadZone);
        else if (this.followed.x - this.xDeadZone < this.xView)
          this.xView = this.followed.x - this.xDeadZone;
      }
      if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
        // moves camera on vertical axis based on followed object position
        if (this.followed.y - this.yView + this.yDeadZone > this.hView)
          this.yView = this.followed.y - (this.hView - this.yDeadZone);
        else if (this.followed.y - this.yDeadZone < this.yView)
          this.yView = this.followed.y - this.yDeadZone;
      }
    }

    // update viewportRect
    this.viewportRect.update(this.xView, this.yView);

    // don't let camera leaves the world's boundary
    if (!this.viewportRect.within(this.worldRect)) {
      if (this.viewportRect.left < this.worldRect.left)
        this.xView = this.worldRect.left;
      if (this.viewportRect.top < this.worldRect.top)
        this.yView = this.worldRect.top;
      if (this.viewportRect.right > this.worldRect.right)
        this.xView = this.worldRect.right - this.wView;
      if (this.viewportRect.bottom > this.worldRect.bottom)
        this.yView = this.worldRect.bottom - this.hView;
    }
  }
}
