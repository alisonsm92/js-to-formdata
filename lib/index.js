const FormData = require('form-data');

/**
 * Checks if the property value is an object
 * @param {*} property
 */
const isObject = (property) => typeof property === 'object';

/**
 * Checks if the property value is an array
 * @param {*} property
 */
const isArray = (property) => Array.isArray(property);

/**
 * Checks if the property value is a Buffer
 * @param {*} property
 */
const isBuffer = (property) => Buffer.isBuffer(property);

/**
 * Checks if the property value is a stream
 * @param {*} property
 */
const isStream = (property) => property !== null
    && typeof property === 'object'
    && typeof property.pipe === 'function';

/**
 * Checks if the property value is a symbol
 * @param {*} property
 */
const isSymbol = (property) => typeof property === 'symbol';

/**
 * Checks if the property value is a primitive type of javascript
 * @param {*} property
 */
const isPrimitiveType = (property) => (property !== Object(property));

/**
 * Checks if array contains some object
 * @param {array} array
 */
const hasSomeObject = (array) => array.some(isObject);

/**
 * Returns the first character of string
 * @param {string} string
 */
const getFirstLetter = ([firstLetter = '']) => firstLetter;

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
 * Removes the last character of the string if it is "s"
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
 * Formats property name using prefix and suffix if any
 * @param {string} rawName
 * @param {Object} [options]
 * @param {string} [options.prefix]
 * @param {string} [options.suffix]
 * @returns {string}
 */
const formatPropertyName = (rawName, { prefix = '', suffix: rawSuffix = '' }) => {
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
const convertArrayOfObjectsToFormData = (array, name, { form }) => {
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
const convertArrayToFormData = (array, name, { form }) => {
    if (hasSomeObject(array)) {
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
            let property = baseObject[originalPropertyName];
            let propertyName = formatPropertyName(originalPropertyName, { prefix });

            if (isSymbol(property)) {
                property = property.toString();
            }
            if (isPrimitiveType(property) || isBuffer(property) || isStream(property)) {
                propertyName = formatPropertyName(originalPropertyName, {
                    prefix,
                    suffix,
                });
                accumulator.append(propertyName, property);

                return accumulator;
            }
            if (isArray(property)) {
                return convertArrayToFormData(property, propertyName, { form });
            }
            if (isObject(property)) {
                return convertObjectToFormData(property, { form, prefix: propertyName, suffix });
            }

            return accumulator;
        }, form)
);

module.exports = convertObjectToFormData;
