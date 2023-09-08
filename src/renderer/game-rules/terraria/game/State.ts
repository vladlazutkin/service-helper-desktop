import { Particle } from '../Particle';
import { Enemy } from '../enemies/Enemy';
import { Bullet } from '../Bullet';
import { Player } from '../Player';
import { GameMap } from '../Map';
import { Camera } from './Camera';
import { Drop } from '../drops/Drop';

class State {
  _particles: Particle[] = [];
  _enemies: Enemy[] = [];
  _bullets: Bullet[] = [];
  _drops: Drop[] = [];

  _player: Player | null = null;
  _map: GameMap | null = null;
  _camera: Camera | null = null;

  constructor() {}

  setPlayer(_player: Player) {
    this._player = _player;
  }
  getPlayer() {
    return this._player!;
  }

  setMap(_map: GameMap) {
    this._map = _map;
  }
  getMap() {
    return this._map!;
  }

  setCamera(_camera: Camera) {
    this._camera = _camera;
  }
  getCamera() {
    return this._camera!;
  }

  addEnemy(enemy: Enemy) {
    this._enemies.push(enemy);
  }
  removeEnemy(enemy: Enemy) {
    this._enemies = this._enemies.filter((e) => e !== enemy);
  }
  getEnemies() {
    return this._enemies;
  }

  addDrop(drop: Drop) {
    this._drops.push(drop);
  }
  removeDrop(drop: Drop) {
    this._drops = this._drops.filter((d) => d !== drop);
  }
  getDrops() {
    return this._drops;
  }

  addBullet(bullet: Bullet) {
    this._bullets.push(bullet);
  }
  removeBullet(bullet: Bullet) {
    this._bullets = this._bullets.filter((b) => b !== bullet);
  }
  getBullets() {
    return this._bullets;
  }

  addParticle(particle: Particle) {
    this._particles.push(particle);
  }
  removeParticle(particle: Particle) {
    this._particles = this._particles.filter((p) => p !== particle);
  }
  getParticles() {
    return this._particles;
  }

  clear() {
    this._map = null;
    this._enemies = [];
    this._bullets = [];
    this._particles = [];
    this._drops = [];
    this._player = null;
    this._camera = null;
  }
}

export default new State();
