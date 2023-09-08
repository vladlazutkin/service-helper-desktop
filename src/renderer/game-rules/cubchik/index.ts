import {
  Color,
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Object3D,
  Vector3,
  Box3,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { CUBE_SIZE, HEIGHT, ROTATE_SPEED, WIDTH } from './constants';
import Game from './Game';
import { isMobile } from '../../helpers/isMobile';

export class CubchikGame {
  scene: Scene;
  cube: Mesh;
  isFalling: boolean = false;
  dummy: Object3D;
  direction: 'left' | 'right' | 'top' | 'bottom' | null = null;
  animate: { top: boolean; left: boolean; right: boolean; bottom: boolean } = {
    top: false,
    right: false,
    left: false,
    bottom: false,
  };
  xDown: number | null = null;
  yDown: number | null = null;

  constructor(container: HTMLDivElement) {
    this.initHandlers();

    const scene = new Scene();
    this.scene = scene;

    scene.background = new Color('skyblue');

    const fov = 35;
    const aspect = WIDTH / HEIGHT;
    const near = 0.1;
    const far = 1000;

    const camera = new PerspectiveCamera(fov, aspect, near, far);

    const cameraOffset = isMobile()
      ? new Vector3(-70, 40, 10)
      : new Vector3(-50, 30, 10);
    camera.position.set(...cameraOffset.toArray());
    const geometry = new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
    const material = new MeshBasicMaterial();

    const dummy = new Object3D();
    scene.add(dummy);
    const cube = new Mesh(geometry, material);

    this.cube = cube;
    this.dummy = dummy;
    dummy.position.set(0, CUBE_SIZE / 2, 0);
    cube.position.set(0, CUBE_SIZE / 2, 0);
    dummy.add(cube);

    const platforms: Mesh[] = [];

    const createPlatform = (x: number, y: number, z: number, color: string) => {
      const geometry = new BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE);
      const material = new MeshBasicMaterial({
        color,
      });
      const platform = new Mesh(geometry, material);
      platform.position.set(x, y, z);
      return platform;
    };

    // const generate = (x: number, y: number, z: number, deep: number = 0) => {
    //   if (deep > 7) {
    //     return;
    //   }
    //   const platform = createPlatform(x, y, z, deep % 2 ? 'green' : 'grey');
    //   scene.add(platform);
    //   platforms.push(platform);
    //   generate(x + CUBE_SIZE, y, z, deep + 1);
    //   if (deep > 2) {
    //     generate(x, y - CUBE_SIZE, z - CUBE_SIZE, deep + 1);
    //     generate(x + CUBE_SIZE, y + CUBE_SIZE, z, deep + 1);
    //   }
    //   // generate(x - 4, z, deep + 1);
    //   // generate(x, z + 4, deep + 1);
    //   // generate(x, z - 4, deep + 1);
    // };
    //
    // generate(0, 0, 0);

    [
      createPlatform(0, 0, 0, 'grey'),
      createPlatform(0, 0, -4, 'green'),
      createPlatform(0, 0, -8, 'grey'),
      createPlatform(0, 0, -12, 'green'),
      createPlatform(0, 4, -12, 'grey'),
      createPlatform(0, 0, -16, 'grey'),
      createPlatform(0, 0, 4, 'green'),
      createPlatform(-4, 0, 4, 'grey'),
      createPlatform(-8, 0, 4, 'green'),
      createPlatform(-8, 4, 4, 'grey'),
      createPlatform(0, 0, 8, 'grey'),
      createPlatform(0, 0, 12, 'green'),
      createPlatform(0, 4, 12, 'grey'),
      createPlatform(4, 0, 0, 'green'),
      createPlatform(8, 0, 0, 'grey'),
      createPlatform(12, 0, 0, 'green'),
      createPlatform(12, 0, 4, 'grey'),
      createPlatform(12, 0, -4, 'grey'),
      createPlatform(12, 0, -8, 'grey'),
      createPlatform(12, 4, 0, 'green'),
    ].forEach((p) => {
      platforms.push(p);
      scene.add(p);
    });

    const renderer = new WebGLRenderer();

    const controls = new OrbitControls(camera, renderer.domElement);

    renderer.setSize(WIDTH, HEIGHT);

    renderer.setPixelRatio(window.devicePixelRatio);

    container.append(renderer.domElement);

    const gameLoop = () => {
      if (dummy.position.y < -50) {
        console.log('end');
        // window.location.reload();
        return;
      }
      if (this.isFalling) {
        dummy.position.y -= 0.5;
      }
      const newObjectPosition = new Vector3();
      cube.getWorldPosition(newObjectPosition);
      const cubeBB = new Box3().setFromObject(dummy);

      const colls = platforms.filter((p) => {
        const platformBB = new Box3().setFromObject(p);
        return cubeBB.intersectsBox(platformBB);
      });

      if (!Game.isPressedAnyKey()) {
        if (!this.isFalling) {
          if (
            !colls.find(
              (c) =>
                c.position.x === newObjectPosition.x &&
                c.position.z === newObjectPosition.z
            )
          ) {
            this.isFalling = true;
          }
        } else {
          if (
            colls.find(
              (c) =>
                c.position.x === newObjectPosition.x &&
                c.position.z === newObjectPosition.z
            )
          ) {
            this.isFalling = false;
          }
        }
      }

      const hasAnimate = Object.values(this.animate).find((v) => v);

      if (hasAnimate) {
        if (this.animate.top) {
          dummy.rotateZ(-ROTATE_SPEED);
          if (dummy.rotation.z > 0) {
            this.animate.top = false;
            dummy.rotation.z = 0;
            dummy.position.x += CUBE_SIZE / 2;
            dummy.position.y += CUBE_SIZE / 2;
            cube.position.x += CUBE_SIZE / 2;
            cube.position.y += CUBE_SIZE / 2;
            Game.controls.up = false;
          }
        } else if (this.animate.right) {
          dummy.rotateX(ROTATE_SPEED);
          if (dummy.rotation.x < 0) {
            this.animate.right = false;
            dummy.rotation.x = 0;
            dummy.position.z += CUBE_SIZE / 2;
            dummy.position.y += CUBE_SIZE / 2;
            cube.position.z += CUBE_SIZE / 2;
            cube.position.y += CUBE_SIZE / 2;
            Game.controls.right = false;
          }
        } else if (this.animate.left) {
          dummy.rotateX(-ROTATE_SPEED);
          if (dummy.rotation.x > 0) {
            this.animate.left = false;
            dummy.rotation.x = -Math.PI;
            Game.controls.left = false;
          }
        } else if (this.animate.bottom) {
          dummy.rotateZ(ROTATE_SPEED);
          if (dummy.rotation.z < 0) {
            this.animate.bottom = false;
            dummy.rotation.z = Math.PI;
            Game.controls.down = false;
          }
        }
      }

      if (!this.isFalling && !hasAnimate) {
        if (Game.controls.up) {
          const topCell = colls.find(
            (c) =>
              c.position.z === newObjectPosition.z &&
              c.position.y === newObjectPosition.y &&
              c.position.x === newObjectPosition.x + CUBE_SIZE
          );
          if (!topCell) {
            dummy.rotateZ(-ROTATE_SPEED);
            if (dummy.rotation.z <= -Math.PI / 2) {
              dummy.rotation.z = 0;
              dummy.position.x += CUBE_SIZE / 2;
              cube.position.x += CUBE_SIZE / 2;
              Game.controls.up = false;
            }
          } else {
            this.animate.top = true;
            this.dummy.position.set(
              this.dummy.position.x || 2,
              6,
              this.dummy.position.z || 2
            );
            this.cube.position.set(-2, -2, -2);
            this.animate.top = true;
          }
        }
        if (Game.controls.down) {
          const bottomCell = colls.find(
            (c) =>
              c.position.z === newObjectPosition.z &&
              c.position.y === newObjectPosition.y &&
              c.position.x === newObjectPosition.x - CUBE_SIZE
          );
          if (!bottomCell) {
            dummy.rotateZ(ROTATE_SPEED);
            if (dummy.rotation.z >= Math.PI / 2) {
              dummy.rotation.z = 0;
              dummy.position.x -= CUBE_SIZE / 2;
              cube.position.x -= CUBE_SIZE / 2;
              Game.controls.down = false;
            }
          } else {
            this.dummy.position.set(
              this.dummy.position.x || -2,
              6,
              this.dummy.position.z || 2
            );
            this.cube.position.set(2, -2, -2);
            this.animate.bottom = true;
          }
        }
        if (Game.controls.right) {
          const rightCell = colls.find(
            (c) =>
              c.position.z === newObjectPosition.z + CUBE_SIZE &&
              c.position.y === newObjectPosition.y &&
              c.position.x === newObjectPosition.x
          );
          if (!rightCell) {
            dummy.rotateX(ROTATE_SPEED);
            if (dummy.rotation.x >= Math.PI / 2) {
              dummy.rotation.x = 0;
              dummy.position.z += CUBE_SIZE / 2;
              cube.position.z += CUBE_SIZE / 2;
              Game.controls.right = false;
            }
          } else {
            // this.dummy.position.set(
            //   this.dummy.position.x || -2,
            //   6,
            //   this.dummy.position.z || 2
            // );
            // this.cube.position.set(2, -2, -2);
            this.animate.right = true;
          }
        }
        if (Game.controls.left) {
          const leftCell = colls.find(
            (c) =>
              c.position.z === newObjectPosition.z - CUBE_SIZE &&
              c.position.y === newObjectPosition.y &&
              c.position.x === newObjectPosition.x
          );
          if (!leftCell) {
            dummy.rotateX(-ROTATE_SPEED);
            if (dummy.rotation.x <= -Math.PI / 2) {
              dummy.rotation.x = 0;
              dummy.position.z -= CUBE_SIZE / 2;
              cube.position.z -= CUBE_SIZE / 2;
              Game.controls.left = false;
            }
          } else {
            this.dummy.position.set(
              this.dummy.position.x || -2,
              6,
              this.dummy.position.z || -2
            );
            this.cube.position.set(2, -2, 2);
            this.animate.left = true;
          }
        }
      }

      camera.position.copy(newObjectPosition).add(cameraOffset);
      camera.lookAt(newObjectPosition);

      renderer.render(scene, camera);
      requestAnimationFrame(gameLoop);
    };
    requestAnimationFrame(gameLoop);
  }

  applyPosition(to: 'left' | 'right' | 'top' | 'bottom') {
    if (!this.direction) {
      switch (to) {
        case 'top':
          this.dummy.position.set(2, 2, 2);
          this.cube.position.set(-2, 2, -2);
          return;
        case 'bottom':
          this.dummy.position.set(-2, 2, 2);
          this.cube.position.set(2, 2, -2);
          return;
        case 'right':
          this.dummy.position.set(-2, 2, 2);
          this.cube.position.set(2, 2, -2);
          return;
        case 'left':
          this.dummy.position.set(-2, 2, -2);
          this.cube.position.set(2, 2, 2);
          return;
      }
    }
    switch (to) {
      case 'top':
        switch (this.direction) {
          case 'top':
          case 'bottom':
            this.dummy.position.set(
              this.dummy.position.x + 2,
              this.dummy.position.y,
              this.dummy.position.z
            );
            this.cube.position.set(
              this.cube.position.x - 2,
              this.cube.position.y,
              this.cube.position.z
            );
            return;
          case 'right':
          case 'left':
            this.dummy.position.set(
              this.dummy.position.x + 4,
              this.dummy.position.y,
              this.dummy.position.z + 2
            );
            this.cube.position.set(
              this.cube.position.x - 4,
              this.cube.position.y,
              this.cube.position.z - 2
            );
            return;
        }
        return;
      case 'bottom':
        switch (this.direction) {
          case 'top':
          case 'bottom':
            this.dummy.position.set(
              this.dummy.position.x - 2,
              this.dummy.position.y,
              this.dummy.position.z
            );
            this.cube.position.set(
              this.cube.position.x + 2,
              this.cube.position.y,
              this.cube.position.z
            );
            return;
          case 'right':
          case 'left':
            this.dummy.position.set(
              this.dummy.position.x,
              this.dummy.position.y,
              this.dummy.position.z + 2
            );
            this.cube.position.set(
              this.cube.position.x,
              this.cube.position.y,
              this.cube.position.z - 2
            );
            return;
        }
        return;
      case 'right':
        switch (this.direction) {
          case 'top':
          case 'bottom':
            this.dummy.position.set(
              this.dummy.position.x - 2,
              this.dummy.position.y,
              this.dummy.position.z
            );
            this.cube.position.set(
              this.cube.position.x + 2,
              this.cube.position.y,
              this.cube.position.z
            );
            return;
          case 'right':
          case 'left':
            this.dummy.position.set(
              this.dummy.position.x - 2,
              this.dummy.position.y,
              this.dummy.position.z + 2
            );
            this.cube.position.set(
              this.cube.position.x + 2,
              this.cube.position.y,
              this.cube.position.z - 2
            );
            return;
        }
        return;
      case 'left':
        switch (this.direction) {
          case 'top':
          case 'bottom':
            this.dummy.position.set(
              this.dummy.position.x + 2,
              this.dummy.position.y,
              this.dummy.position.z - 4
            );
            this.cube.position.set(
              this.cube.position.x - 2,
              this.cube.position.y,
              this.cube.position.z + 4
            );
            return;
          case 'right':
          case 'left':
            this.dummy.position.set(
              this.dummy.position.x - 2,
              this.dummy.position.y,
              this.dummy.position.z - 2
            );
            this.cube.position.set(
              this.cube.position.x + 2,
              this.cube.position.y,
              this.cube.position.z + 2
            );
            return;
        }
    }
  }

  initHandlers() {
    window.addEventListener('touchstart', (event) => {
      const firstTouch = event.touches[0];
      this.xDown = firstTouch.clientX;
      this.yDown = firstTouch.clientY;
    });
    window.addEventListener('touchmove', (event) => {
      if (!this.xDown || !this.yDown) {
        return;
      }
      const xUp = event.touches[0].clientX;
      const yUp = event.touches[0].clientY;

      const xDiff = this.xDown - xUp;
      const yDiff = this.yDown - yUp;

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff < 0) {
          this.applyPosition('right');
          this.direction = 'right';
          Game.controls.right = true;
        } else {
          this.applyPosition('left');
          this.direction = 'left';
          Game.controls.left = true;
        }
      } else {
        if (yDiff < 0) {
          this.applyPosition('bottom');
          this.direction = 'bottom';
          Game.controls.down = true;
        } else {
          this.applyPosition('top');
          this.direction = 'top';
          Game.controls.up = true;
        }
      }
      this.xDown = null;
      this.yDown = null;
    });
    window.addEventListener(
      'keydown',
      (e) => {
        if (Game.isPressedAnyKey()) {
          return;
        }
        switch (e.keyCode) {
          case 38: // up arrow
            this.applyPosition('top');
            this.direction = 'top';
            Game.controls.up = true;
            break;
          case 40: // down arrow
            this.applyPosition('bottom');
            this.direction = 'bottom';
            Game.controls.down = true;
            break;
          case 39: // right arrow
            this.applyPosition('right');
            this.direction = 'right';
            Game.controls.right = true;
            break;
          case 37: // left arrow
            this.applyPosition('left');
            this.direction = 'left';
            Game.controls.left = true;
            break;
        }
      },
      false
    );
  }
}
