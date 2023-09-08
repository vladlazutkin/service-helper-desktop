export interface BaseObject {
  update: () => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
}
