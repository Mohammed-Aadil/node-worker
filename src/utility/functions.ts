/**
 * @description return values array of object
 * @param {Object} obj
 * @returns {Array}
 */
export function getObjectValues(obj: Object) {
    return Object.keys(obj).map(key => obj[key]);
};
