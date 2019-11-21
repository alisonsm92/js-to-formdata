const FormData = require('form-data');

/**
 * Checks if the property value is an object
 * @param {*} property
 */
const isObject = (property) => property === Object(property);

/**
 * Checks if the property value is an array
 * @param {*} property
 */
const isArray = (property) => Array.isArray(property);

/**
 * Checks if the property value is a function
 * @param {*} property
 */
const isFunction = (property) => typeof property === 'function';

/**
 * Checks if the property value is an object
 * @param {*} property
 */
const isNestedProperty = (property) => isObject(property);

/**
 * Checks if array contains some object
 * @param {array} array
 */
const hasObject = (array) => array.some(isObject);

/**
 * Returns the first character of string
 * @param {string} string
 */
const getFirstLetter = (string) => string.slice(0, 1);

/**
 * Returns the last character of the string
 * @param {string} string
 */
const getLastLetter = (string) => string.slice(-1);

/**
 * Remove the first character of the string
 * @param {string} string
 */
const removeFirstLetter = (string) => string.slice(1);

/**
 * Removes the last character of the string
 * @param {string} string
 */
const removeLastLetter = (string) => string.slice(0, -1);

/**
 * Removes the last character of the string if is "s"
 * @param {string} string
 */
const removePlural = (string) => (getLastLetter(string) === 's'
    ? removeLastLetter(string)
    : string);

/**
 * Converts the first character of the string to upper case
 * @param {string} string
 */
const upperCaseFirstLetter = (string) => (
    `${getFirstLetter(string).toUpperCase()}${removeFirstLetter(string)}`
);

/**
 * Formats the prefix for array of objects items
 * @param {string} name
 */
const formatArrayPrefix = (name) => removePlural(name);

/**
 * Formats the suffix for array of objects items
 * @param {number} index
 */
const formatArraySuffix = (index) => (index + 1).toString();

/**
 * Formats the name of items of array of objects
 * @param {string} name
 * @param {number} index
 */
const formatArrayItemName = (name, index) => `${removePlural(name)}${(index + 1).toString()}`;

/**
 * Format property name using prefix and suffix if any
 * @param {string} rawName
 * @param {Object} [options]
 * @param {string} [options.prefix]
 * @param {string} [options.suffix]
 * @returns {string}
 */
const formatPropertyName = (rawName, { prefix = '', suffix: rawSuffix = '' } = {}) => {
    const name = prefix ? upperCaseFirstLetter(rawName) : rawName;
    const suffix = upperCaseFirstLetter(rawSuffix);

    return `${prefix}${name}${suffix}`;
};

/**
 * Converts array of objects to single-depth form data
 * @param {Array} array Array of objects to be converted
 * @param {string} name Name of the array, to use like prefix of items properties
 * @param {Object} [options]
 * @param {Object} [options.form]
 * @returns {FormData}
 */
const convertArrayOfObjectsToFormData = (array, name, { form = new FormData() }) => {
    array.forEach((item, index) => {
        if (isObject(item)) {
            // eslint-disable-next-line no-use-before-define
            return convertObjectToFormData(item, {
                form, prefix: formatArrayPrefix(name), suffix: formatArraySuffix(index),
            });
        }

        const propertyName = formatArrayItemName(name, index);
        form.append(propertyName, item);

        return form;
    });

    return form;
};

/**
 * Converts array to form data
 * @param {Array} array Array of objects to be converted
 * @param {string} name Name of the array, to use like prefix of items properties
 * @param {Object} [options]
 * @param {Object} [options.form]
 * @returns {FormData}
 */
const convertArrayToFormData = (array, name, { form = new FormData() }) => {
    if (hasObject(array)) {
        return convertArrayOfObjectsToFormData(array, name, { form });
    }

    form.append(name, JSON.stringify(array));

    return form;
};

/**
 * Converts object to form data
 * @param {Object} baseObject
 * @param {Object} [options]
 * @param {Object} [options.form]
 * @param {string} [options.prefix]
 * @param {string} [options.suffix]
 * @returns {FormData}
 */
const convertObjectToFormData = (baseObject, { form = new FormData(), prefix, suffix } = {}) => (
    Object.keys(baseObject)
        .reduce((accumulator, originalPropertyName) => {
            const property = baseObject[originalPropertyName];
            let propertyName = formatPropertyName(originalPropertyName, { prefix });

            if (isFunction(property)) {
                return accumulator;
            }
            if (isArray(property)) {
                return convertArrayToFormData(property, propertyName, { form });
            }
            if (isNestedProperty(property)) {
                return convertObjectToFormData(property, { form, prefix: propertyName, suffix });
            }

            propertyName = formatPropertyName(originalPropertyName, { prefix, suffix });
            accumulator.append(propertyName, property);

            return accumulator;
        }, form)
);

module.exports = {
    convertObjectToFormData,
};
