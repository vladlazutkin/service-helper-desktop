import Game from './Game';
import { GameMap, MapObject } from './Map';
import { VIEW_HEIGHT } from './constants';

type IntersectionResult =
  | { collision: true; coors: { x: number; y: number }; side: string }
  | { collision: false };

export class Player {
  x: number;
  y: number;
  speed: number;
  jumpSpeed: number;
  width: number;
  height: number;
  goingDown: boolean = false;
  jumpY: number = 0;
  isJumping: boolean = false;
  isFalling: boolean = false;
  velocity: number = 1;
  jumpHeight: number = 200;
  fallSpeed: number;
  doubleJump: boolean = false;
  direction: 'left' | 'right' = 'right';
  collisionTime = {
    left: 0,
    right: 0,
    top: 0,
  };

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.speed = 200;
    this.jumpSpeed = 800;
    this.fallSpeed = 800;

    this.width = 50;
    this.height = 50;
  }

  copy() {
    return new Player(this.x, this.y);
  }

  jump(changeDir: boolean = false) {
    if (this.isJumping) {
      if (this.doubleJump) {
        return;
      }
      this.doubleJump = true;
      this.jumpY = this.y;
      this.velocity = 1;
      this.goingDown = false;
      if (changeDir) {
        this.direction = this.direction === 'right' ? 'left' : 'right';
      }
      return;
    }
    this.jumpY = this.y;
    this.isJumping = true;
    this.isFalling = false;
    this.fallSpeed = this.jumpSpeed;
    this.velocity = 1;
    this.goingDown = false;
    this.collisionTime = {
      left: 0,
      right: 0,
      top: 0,
    };
  }

  fall(smooth: boolean = false) {
    if (smooth) {
      this.fallSpeed = 100;
    }
    this.isFalling = true;
    this.goingDown = true;
  }

  checkIntersectionActive(
    rect: MapObject
  ): { collision: false } | { collision: true; side: string } {
    if (this.y + this.height > rect.y && this.y < rect.y + rect.height) {
      if (this.x + this.width === rect.x) {
        return {
          collision: true,
          side: 'right',
        };
      } else if (this.x === rect.x + rect.width) {
        return {
          collision: true,
          side: 'left',
        };
      }
    } else if (this.x < rect.x + rect.width && this.x + this.width > rect.x) {
      if (this.y === rect.y + rect.height) {
        return {
          collision: true,
          side: 'top',
        };
      } else if (this.y + this.height === rect.y) {
        return {
          collision: true,
          side: 'bottom',
        };
      }
    }
    return { collision: false };
  }

  checkIntersection(rect: MapObject): IntersectionResult {
    if (this.y + this.height > rect.y && this.y < rect.y + rect.height) {
      //From player left move to right collision
      if (
        this.x + this.width > rect.x &&
        rect.x + rect.width > this.x + this.width
      ) {
        return {
          collision: true,
          coors: {
            x: rect.x - this.width,
            y: this.y,
          },
          side: 'right',
        };
        //From player right move to left collision
      } else if (this.x < rect.x + rect.width && rect.x < this.x) {
        return {
          collision: true,
          coors: {
            x: rect.x + rect.width,
            y: this.y,
          },
          side: 'left',
        };
      }
    } else if (this.x < rect.x + rect.width && this.x + this.width > rect.x) {
      //From bottom jump to ceiling collision
      if (this.y < rect.y + rect.height && rect.y < this.y) {
        return {
          collision: true,
          coors: {
            x: this.x,
            y: rect.y + rect.height,
          },
          side: 'top',
        };
        //From top fall to rectangle floor collision
      } else if (
        this.y + this.height > rect.y &&
        rect.y + rect.height > this.y
      ) {
        return {
          collision: true,
          coors: {
            x: this.x,
            y: rect.y - this.height,
          },
          side: 'bottom',
        };
      }
    }
    return { collision: false };
  }

  update(step: number, worldWidth: number, worldHeight: number, map: GameMap) {
    if (this.isJumping || this.isFalling) {
      if (!this.goingDown) {
        if (Math.abs(this.y - this.jumpY) < this.jumpHeight) {
          this.y -=
            ((this.isFalling ? this.fallSpeed : this.jumpSpeed) * step) /
            this.velocity;
          this.x += this.isFalling
            ? 0
            : ((this.jumpSpeed * step) / 2 / this.velocity) *
              (this.direction === 'right' ? 1 : -1);
          this.velocity *= 1.05;
          this.velocity = Math.min(this.velocity, 5);
        } else {
          this.goingDown = true;
        }
      } else {
        this.y +=
          ((this.isFalling ? this.fallSpeed : this.jumpSpeed) * step) /
          this.velocity;
        this.x += this.isFalling
          ? 0
          : ((this.jumpSpeed * step) / 2 / this.velocity) *
            (this.direction === 'right' ? 1 : -1);
        this.velocity /= 1.05;
        this.velocity = Math.max(this.velocity, 1);
        if (this.y + this.height >= VIEW_HEIGHT) {
          this.goingDown = false;
          this.isJumping = false;
          this.isFalling = false;
          this.fallSpeed = this.jumpSpeed;
          this.velocity = 1;
          this.doubleJump = false;
        }
      }
    }

    const intActives = map.maps
      .map((m) => this.checkIntersectionActive(m))
      .filter((c) => c.collision);

    const topCol = intActives.find(
      (int) => int.collision && int.side === 'top'
    );
    const leftCol = intActives.find(
      (int) => int.collision && int.side === 'left'
    );
    const rightCol = intActives.find(
      (int) => int.collision && int.side === 'right'
    );
    if (topCol) {
      if (!this.collisionTime.top) {
        this.collisionTime.top = Date.now();
      } else if (Date.now() - this.collisionTime.top > 2000) {
        this.collisionTime.top = 0;
        this.fall();
      }
    }
    if (rightCol && !this.isFalling) {
      this.direction = 'left';
      if (!this.collisionTime.right) {
        this.collisionTime.right = Date.now();
      } else if (Date.now() - this.collisionTime.right > 2000) {
        this.collisionTime.right = 0;
        this.fall(true);
      }
    }
    if (leftCol && !this.isFalling) {
      this.direction = 'right';
      if (!this.collisionTime.left) {
        this.collisionTime.left = Date.now();
      } else if (Date.now() - this.collisionTime.left > 2000) {
        this.collisionTime.left = 0;
        this.fall(true);
      }
    }

    const copy = this.copy();
    if (Game.controls.left && !leftCol) {
      this.direction = 'left';
      copy.x -= this.speed * step;
    }
    if (Game.controls.up) {
      copy.y -= this.speed * step;
    }
    if (Game.controls.right && !rightCol) {
      this.direction = 'right';
      copy.x += this.speed * step;
    }
    if (Game.controls.down && !topCol) {
      copy.y += this.speed * step;
    }

    const int = map.maps
      .map((m) => copy.checkIntersection(m))
      .find((c) => c.collision);
    if (int?.collision && !this.isFalling) {
      this.x = int.coors.x;
      this.y = int.coors.y;
      this.direction = int.side === 'left' ? 'left' : 'right';
      this.goingDown = false;
      this.isJumping = false;
      this.fallSpeed = this.jumpSpeed;
      this.velocity = 1;
      this.doubleJump = false;
      return;
    }

    this.x = copy.x;
    this.y = copy.y;

    if (this.x <= 0) {
      this.x = 0;
    }
    if (this.y <= 0) {
      this.y = 0;
    }
    if (this.x + this.width >= worldWidth) {
      this.x = worldWidth - this.width;
    }
    if (this.y + this.height >= worldHeight) {
      this.y = worldHeight - this.height;
    }
    if (
      this.y + this.height !== VIEW_HEIGHT &&
      !intActives.length &&
      !this.isJumping &&
      !Object.values(Game.controls).find((v) => v)
    ) {
      this.fall();
    }
  }

  draw(context: CanvasRenderingContext2D, xView: number, yView: number) {
    context.fillStyle = '#ff7c7c';
    context.fillRect(this.x - xView, this.y - yView, this.width, this.height);
  }
}
