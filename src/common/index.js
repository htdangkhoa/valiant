export const isURL = (url) => {
  const expression = /\b((http|https):\/\/?)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/g;

  const regex = new RegExp(expression);

  return !!url.match(regex);
};

export const first = (input) => {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    return undefined;
  }

  return [...input].splice(0, 1)[0];
};
