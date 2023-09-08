export const getAngle = (
  posx1: number,
  posy1: number,
  posx2: number,
  posy2: number
) => {
  const xDist = posx1 - posx2;
  const yDist = posy1 - posy2;

  if (posx1 < posx2) {
    return Math.atan2(posy2 - posy1, posx2 - posx1);
  } else {
    return Math.atan2(posy2 - posy1, posx2 - posx1);
  }
};
