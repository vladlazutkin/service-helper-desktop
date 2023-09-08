export interface LiveObject {
  HP: number;
  totalHP: number;
  takeDamage: (damage: number, color: string) => void;
  isAlive: boolean;
}
