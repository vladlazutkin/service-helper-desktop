export const getImg = (url: string) => {
  if (url.includes('http')) {
    return url;
  }
  return `${process.env.REACT_APP_BACKEND_URL}/${url}`;
};
