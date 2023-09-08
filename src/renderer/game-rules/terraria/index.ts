import Game from './game/Game';
import { Player } from './Player';
import { Camera } from './game/Camera';
import { GameMap } from './Map';
import { DROP_TYPE, HEIGHT, VIEW_HEIGHT, VIEW_WIDTH, WIDTH } from './constants';
import { Enemy } from './enemies/Enemy';
import { Particle } from './Particle';
import { Bullet } from './Bullet';
import EventEmitter from './game/EventEmitter';
import State from './game/State';
import { KEY } from '../constants';
import { UI } from './UI';
import { Sword } from './weapons/Sword';
import { Dungeon } from './enemies/Dungeon';
import { Drop } from './drops/Drop';
import { AddHpPercentDrop } from './drops/buffs/AddHpPercentDrop';
import { AddSpeedPercentDrop } from './drops/buffs/AddSpeedPercentDrop';
import { getRandomInteger } from '../../helpers/getRandomInt';
import { AddFireRatePercentDrop } from './drops/buffs/AddFireRatePercentDrop';
import { Flamethrower } from './weapons/Flamethrower';

const c = require('renderer/assets/images/games/terraria/sprites/Cursor_0.png');

export class TerrariaGame {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  interval: number = -1;
  fps: number = 0;
  dimensions: DOMRect = {} as DOMRect;

  ui: UI;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.canvas.height = HEIGHT;
    this.canvas.width = WIDTH;
    this.canvas.style.borderRadius = '5px';
    canvas.style.cursor = `url(${c}), auto`;
    this.dimensions = canvas.getBoundingClientRect();

    this.ui = new UI();
    this.init();
    Game.debug = true;
  }

  init() {
    this.initHandlers();
    this.initEvents();
    State.setPlayer(
      new Player(WIDTH / 2, VIEW_HEIGHT - HEIGHT / 2, new Flamethrower())
    );

    const map = new GameMap(VIEW_WIDTH, VIEW_HEIGHT);
    map.generate();
    State.setMap(map);
    // const swords = new CustomSwords(WIDTH / 2 - 300, HEIGHT / 2);

    const vWidth = Math.min(VIEW_WIDTH, WIDTH);
    const vHeight = Math.min(VIEW_HEIGHT, HEIGHT);

    const camera = new Camera(0, 0, vWidth, vHeight, VIEW_WIDTH, VIEW_HEIGHT);
    camera.follow(State.getPlayer(), vWidth / 2, vHeight / 2);
    State.setCamera(camera);

    const FPS = 60;
    const INTERVAL = 1000 / FPS;
    Game.step = INTERVAL / 1000;

    const update = () => {
      State.getBullets().forEach((b) => b.update());
      State.getEnemies().forEach((enemy) => enemy.update());
      State.getPlayer().update();
      State.getCamera().update();
      State.getParticles().forEach((p) => p.update());
      State.getDrops().forEach((d) => d.update());
      // swords.update();

      this.ui.update();

      if (State.getEnemies().length < 5) {
        if (Math.random() > 0.5) {
          const enemy = new Dungeon(
            WIDTH / 2 + Math.random() * 500,
            VIEW_HEIGHT - HEIGHT / 2 + (Math.random() - 0.5) * 400,
            Math.round(5000 + Math.random() * 5000)
          );
          State.addEnemy(enemy as Enemy);
        } else {
          const enemy = new Enemy(
            WIDTH / 2 + Math.random() * 500,
            VIEW_HEIGHT - HEIGHT / 2 + (Math.random() - 0.5) * 400,
            Math.round(5000 + Math.random() * 5000)
          );
          State.addEnemy(enemy as Enemy);
        }
      }

      // if (State.getDrops().length < 3) {
      //   const drops = [
      //     AddHpPercentDrop,
      //     AddSpeedPercentDrop,
      //     AddFireRatePercentDrop,
      //   ];
      //   const R = drops[getRandomInteger(0, drops.length - 1)];
      //   const drop = new R(
      //     WIDTH / 2 + Math.random() * 500,
      //     VIEW_HEIGHT - HEIGHT / 2 + (Math.random() - 0.5) * 400,
      //     DROP_TYPE.HP
      //   );
      //   State.addDrop(drop);
      // }
    };

    const clearRect = () => {
      this.ctx.clearRect(0, 0, WIDTH, HEIGHT);
      this.ctx.fillStyle = '#484848';
      this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
    };

    const drawFps = () => {
      this.ctx.font = '24px serif';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(`${Math.round(this.fps)} fps`, 0, 20);
    };

    const draw = () => {
      clearRect();

      State.getMap().draw(this.ctx);
      State.getEnemies().forEach((enemy) => enemy.draw(this.ctx));
      State.getBullets().forEach((b) => b.draw(this.ctx));
      State.getPlayer().draw(this.ctx);
      State.getParticles().forEach((p) => p.draw(this.ctx));
      State.getDrops().forEach((d) => d.draw(this.ctx));

      this.ui.draw(this.ctx);
      drawFps();
      // swords.draw(this.ctx, this.camera.xView, this.camera.yView);
    };

    // swords.update(
    //   e.clientX - 90 + this.camera.xView,
    //   e.clientY - 50 + this.camera.yView
    // );

    const gameLoop = () => {
      update();
      draw();
    };
    let frameCount = 0;
    let startTime: number;
    let now;
    let then: number;
    let elapsed;
    const animate = () => {
      this.interval = requestAnimationFrame(animate);
      now = Date.now();
      elapsed = now - then;

      if (elapsed > INTERVAL) {
        gameLoop();
        then = now - (elapsed % INTERVAL);
        const sinceStart = now - startTime;
        this.fps = Math.round((1000 / (sinceStart / ++frameCount)) * 100) / 100;
        // console.log(`${this.fps} fps`);
      }
    };
    then = Date.now();
    startTime = then;
    animate();
  }

  unmount() {
    cancelAnimationFrame(this.interval);
    State.clear();
    EventEmitter.unsubscribeFromAll();
  }

  initEvents() {
    EventEmitter.subscribe('bullet-create', (bullet: Bullet) => {
      State.addBullet(bullet);
    });
    EventEmitter.subscribe('particle-create', (particle: Particle) => {
      State.addParticle(particle);
    });
    EventEmitter.subscribe('drop-create', (drop: Drop) => {
      State.addDrop(drop);
    });

    EventEmitter.subscribe('enemy-die', (enemy: Enemy) => {
      State.removeEnemy(enemy);
    });
    EventEmitter.subscribe('bullet-die', (bullet: Bullet) => {
      State.removeBullet(bullet);
    });
    EventEmitter.subscribe('particle-die', (particle: Particle) => {
      State.removeParticle(particle);
    });
    EventEmitter.subscribe('drop-die', (drop: Drop) => {
      State.removeDrop(drop);
    });
    EventEmitter.subscribe('player-die', (particle: Particle) => {
      alert('You die');
      this.unmount();
      this.init();
    });
  }

  updateMouseCoords(e: MouseEvent) {
    const { xView, yView } = State.getCamera();
    Game.state.mouse.x = e.clientX - this.dimensions.left + xView;
    Game.state.mouse.y = e.clientY - this.dimensions.top + yView;
  }

  initHandlers() {
    window.addEventListener(
      'keydown',
      (e) => {
        this.ui.handleKeyDown(e.key);
        if (e.metaKey) {
          Game.controls.cmd = true;
        }
        switch (e.keyCode) {
          case KEY.ARROW_LEFT:
          case KEY.A:
            Game.controls.left = true;
            break;
          // case KEY.ARROW_UP:
          // case KEY.W:
          //   Game.controls.up = true;
          //   break;
          case KEY.ARROW_RIGHT:
          case KEY.D:
            Game.controls.right = true;
            break;
          case KEY.ARROW_DOWN:
          case KEY.S:
            Game.controls.down = true;
            break;
          case KEY.SPACE:
            State.getPlayer().jump();
            break;
        }
      },
      false
    );

    window.addEventListener(
      'keyup',
      function (e) {
        if (!e.metaKey) {
          Game.controls.cmd = false;
        }
        switch (e.keyCode) {
          case KEY.ARROW_LEFT:
          case KEY.A:
            Game.controls.left = false;
            break;
          // case KEY.ARROW_UP:
          // case KEY.W:
          //   Game.controls.up = false;
          //   break;
          case KEY.ARROW_RIGHT:
          case KEY.D:
            Game.controls.right = false;
            break;
          case KEY.ARROW_DOWN:
          case KEY.S:
            Game.controls.down = false;
            break;
          case KEY.SPACE:
            Game.controls.space = false;
            break;
        }
      },
      false
    );

    window.addEventListener('mousedown', (e) => {
      this.updateMouseCoords(e);
      const continueClick = this.ui.click();
      if (continueClick) {
        Game.controls.mouseDown = true;
        State.getPlayer().shoot();
      }
    });
    window.addEventListener('mousemove', (e) => {
      this.updateMouseCoords(e);
      this.ui.mouseMove(this.canvas);
    });
    window.addEventListener('mouseup', () => {
      Game.controls.mouseDown = false;
    });
  }
}
