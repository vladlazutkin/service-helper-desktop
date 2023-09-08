import { BaseObject } from './game/interfaces/BaseObject';
import { WIDTH } from './constants';
import State from './game/State';
import Game from './game/Game';
import { Riffle } from './weapons/Riffle';
import { Shotgun } from './weapons/Shotgun';
import { Flamethrower } from './weapons/Flamethrower';
import { createImgSprite } from './helpers/createImgSprite';
import { Weapon } from './weapons/Weapon';
import { Sword } from './weapons/Sword';
import { MeleeWeapon } from './weapons/MeleeWeapon';

const riffle = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/riffle.png')
);
const shotgun = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/shotgun.png')
);
const flamethrower = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/flamethrower.png')
);
const sword = createImgSprite(
  require('renderer/assets/images/games/terraria/sprites/sword.png')
);

const spriteWidth = 70;
const spriteHeight = 70;

interface WeaponObject {
  x: number;
  y: number;
  sprite: HTMLImageElement;
  weapon: Weapon | MeleeWeapon;
  position: number;
}

const weaponList: WeaponObject[] = [
  { x: 70, y: 0, sprite: sword, weapon: new Sword(), position: 1 },
  { x: 143, y: 0, sprite: riffle, weapon: new Riffle(), position: 2 },
  { x: 216, y: 0, sprite: shotgun, weapon: new Shotgun(), position: 3 },
  {
    x: 289,
    y: 0,
    sprite: flamethrower,
    weapon: new Flamethrower(),
    position: 4,
  },
];

export class UI implements BaseObject {
  draw(ctx: CanvasRenderingContext2D) {
    const player = State.getPlayer();
    // Player HP
    ctx.font = '20px serif';
    ctx.fillStyle = 'white';
    ctx.fillText('HP', WIDTH - 330, 17);
    ctx.fillStyle = 'grey';
    ctx.fillRect(WIDTH - 300, 0, 300, 20);
    ctx.fillStyle = 'green';
    ctx.fillRect(WIDTH - 300, 0, 300 * (player.HP / player.totalHP), 20);
    ctx.font = '16px serif';
    ctx.fillStyle = 'white';
    ctx.fillText(`${Math.round(player.HP)}/${player.totalHP}`, WIDTH - 200, 15);

    // Player buffs
    ctx.font = '16px serif';
    ctx.fillStyle = 'white';
    const speedText = `Speed: ${player.speed.toFixed(2)}`;
    const metricsSpeed = ctx.measureText(speedText);
    ctx.fillText(speedText, WIDTH - metricsSpeed.width, 35);

    const fireRateMultiplierText = `Fire rate multiplier: ${player.fireRateMultiplier.toFixed(
      2
    )}`;
    const fireRateMultiplierMetrics = ctx.measureText(fireRateMultiplierText);
    ctx.fillText(
      fireRateMultiplierText,
      WIDTH - fireRateMultiplierMetrics.width,
      50
    );

    const damageMultiplierText = `Damage multiplier: ${player.damageMultiplier.toFixed(
      2
    )}`;
    const damageMultiplierMetrics = ctx.measureText(damageMultiplierText);
    ctx.fillText(
      damageMultiplierText,
      WIDTH - damageMultiplierMetrics.width,
      65
    );

    // Weapon list
    ctx.lineWidth = 1;
    const activeWeapon = player.weapon;
    weaponList.forEach((item) => {
      ctx.drawImage(item.sprite, item.x, item.y, spriteWidth, spriteHeight);
      ctx.strokeStyle = activeWeapon.tag === item.weapon.tag ? 'red' : 'grey';
      ctx.font = 'bold 16px serif';
      ctx.fillStyle = 'white';
      ctx.fillText(
        item.position.toString(),
        item.x + spriteWidth - 12,
        item.y + spriteHeight - 5
      );
      ctx.strokeRect(item.x, item.y, spriteWidth, spriteHeight);
    });
  }

  click() {
    const camera = State.getCamera();
    const x = Game.state.mouse.x - camera.xView;
    const y = Game.state.mouse.y - camera.yView;

    if (y < spriteHeight) {
      const player = State.getPlayer();
      const found = weaponList.find(
        (item) => x >= item.x && x < item.x + spriteWidth
      );
      if (found) {
        player.setWeapon(found.weapon);
        return false;
      }
    }
    return true;
  }

  handleKeyDown(key: string) {
    const num = parseInt(key);
    const isNumber = isFinite(num);
    if (isNumber) {
      const found = weaponList.find((item) => item.position === num);
      if (found) {
        const player = State.getPlayer();
        player.setWeapon(found.weapon);
      }
    }
  }

  mouseMove(canvas: HTMLCanvasElement) {
    const camera = State.getCamera();
    const x = Game.state.mouse.x - camera.xView;
    const y = Game.state.mouse.y - camera.yView;

    if (y < spriteHeight) {
      const found = weaponList.find(
        (item) => x >= item.x && x < item.x + spriteWidth
      );
      if (found) {
        return (canvas.style.cursor = 'pointer');
      }
    }
    canvas.style.cursor = 'initial';
  }

  update() {}
}
