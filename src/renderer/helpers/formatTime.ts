export const formatTime = (time: number, includeHours = false) => {
  const date = new Date(0);
  date.setSeconds(time);
  const str = date.toISOString().substring(11, 19);
  return includeHours ? str : str.replace('00:', '');
};
