import { GameMap, MapObject } from './Map';
import { SPHERE_RADIUS } from './constants';
import { Platform } from './Platform';

export class Sphere {
  x: number;
  y: number;
  defaultCoors: { x: number; y: number };
  speed: number;
  radius: number;
  dx: number = 0;
  dy: number = 0;
  isStarted: boolean = false;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.defaultCoors = { x, y };

    this.speed = 400;
    this.radius = SPHERE_RADIUS;
  }

  reset() {
    this.x = this.defaultCoors.x;
    this.y = this.defaultCoors.y;
    this.isStarted = false;
    this.dy = 0;
    this.dx = 0;
  }

  start() {
    if (this.isStarted) {
      return;
    }
    this.dy = -1;
    this.dx = 0;
    this.isStarted = true;
  }

  checkIntersection(rect: MapObject): boolean {
    const distX = Math.abs(this.x - rect.x - rect.width / 2);
    const distY = Math.abs(this.y - rect.y - rect.height / 2);

    if (distX > rect.width / 2 + this.radius) {
      return false;
    }
    if (distY > rect.height / 2 + this.radius) {
      return false;
    }

    if (distX <= rect.width / 2) {
      return true;
    }
    if (distY <= rect.height / 2) {
      return true;
    }

    const dx = distX - rect.width / 2;
    const dy = distY - rect.height / 2;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  update(
    step: number,
    worldWidth: number,
    worldHeight: number,
    map: GameMap,
    platform: Platform
  ) {
    this.x += this.dx * step * this.speed;
    this.y += this.dy * step * this.speed;

    if (this.x - this.radius <= 0) {
      this.dx = -this.dx;
    }
    if (this.y - this.radius <= 0) {
      this.dy = -this.dy;
    }
    if (this.x + this.radius >= worldWidth) {
      this.dx = -this.dx;
    }
    if (this.y + this.radius >= worldHeight) {
      platform.reset();
      return this.reset();
    }

    if (this.isStarted) {
      const block = map.maps.find((el) => this.checkIntersection(el));
      if (block) {
        this.dy = -this.dy;
        map.maps = map.maps.filter((b) => b !== block);
      }

      if (
        this.y + this.radius >= platform.y &&
        this.y + this.radius <= platform.y + platform.height / 2 &&
        this.x + this.radius >= platform.x &&
        this.x - this.radius <= platform.x + platform.width
      ) {
        let collidePoint = this.x - (platform.x + platform.width / 2);
        collidePoint = collidePoint / (platform.width / 2);
        const angle = collidePoint * (Math.PI / 3);
        this.dx = Math.sin(angle);
        this.dy = -1 * Math.cos(angle);
      }
    }
  }

  draw(context: CanvasRenderingContext2D, xView: number, yView: number) {
    context.fillStyle = '#ff7c7c';
    context.beginPath();
    context.arc(
      this.x - xView,
      this.y - yView,
      this.radius,
      0,
      2 * Math.PI,
      false
    );
    context.fill();
    // context.lineWidth = 5;
    // context.strokeStyle = '#003300';
    // context.stroke();
  }
}
