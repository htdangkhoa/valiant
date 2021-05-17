export const classnames = (...classes) =>
  classes
    .filter(Boolean)
    .filter((s) => typeof s === 'string')
    .join(' ')
    .trim();
