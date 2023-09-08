export const throttle = (func: (...args: any) => void, ms: number) => {
  let isThrottled = false;

  function wrapper(...args: any) {
    if (isThrottled) {
      return;
    }
    func(...args);
    isThrottled = true;
    setTimeout(() => {
      isThrottled = false;
    }, ms);
  }

  return wrapper;
};
