/**
 * To return function which used to tag template literals
 * @export
 * @param {string[]} strings pass by template literals
 * @param {(...(number | string)[])} keys pass by template literals
 * @return function to call for injecting values to template literals
 */
export function tagTemplate<T = Record<string, any> | number>(strings: TemplateStringsArray, ...keys: (number | string)[]) {
  // return function to inject actual values
  return (...values: T[]) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value ?? key, strings[i + 1]);
    });
    return result.join('');
  };
}
