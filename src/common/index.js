export const isURL = (s) => {
  const pattern = /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/;

  if (pattern.test(s)) {
    return true;
  }

  return pattern.test(`http://${s}`);
};

export const first = (input) => {
  if (typeof input !== 'string' && !Array.isArray(input)) {
    return undefined;
  }

  return [...input].splice(0, 1)[0];
};
