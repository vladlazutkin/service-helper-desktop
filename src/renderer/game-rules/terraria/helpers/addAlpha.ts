export const addAlpha = (color: string, opacity: number) => {
  // const _opacity = Math.max(
  //   Math.ceil(Math.min(Math.max(opacity, 0), 1) * 255),
  //   1
  // );
  // return color + _opacity.toString(16).toUpperCase();
  const _opacity = Math.round(Math.min(Math.max(opacity, 0), 1) * 255);
  let opacityHex = _opacity.toString(16).toUpperCase();

  if (opacityHex.length === 1) {
    opacityHex = `0${opacityHex}`;
  }

  return color + opacityHex;
};
