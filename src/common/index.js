export const isURL = (url) => {
  const expression = /\b((http|https):\/\/?)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/g;

  const regex = new RegExp(expression);

  return !!url.match(regex);
};
