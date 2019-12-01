// @ts-nocheck
const chai = require('chai');
const fs = require('fs');
const convertObjectToFormData = require('../index');

const { assert } = chai;
chai.use(require('chai-string'));

describe('Convert object to form data', () => {
    it('Should return a form data containing the original object properties',
        () => {
            const originalObject = {
                property: 'value',
                anotherProperty: 'value',
            };

            const formData = convertObjectToFormData(originalObject);
            const formDataString = formData.getBuffer().toString();

            Object.keys(originalObject).forEach((property) => {
                assert.include(
                    formDataString, `name="${property}"\r\n\r\n${originalObject[property]}`,
                );
            });
        });

    it('Should return a form data containing the original object properties, even nested properties',
        () => {
            const originalObject = {
                property: {
                    nestedProperty: 'value',
                },
                anotherProperty: 'value',
            };

            const formData = convertObjectToFormData(originalObject);
            const formDataString = formData.getBuffer().toString();

            assert.include(formDataString, 'name="propertyNestedProperty"\r\n\r\nvalue');
            assert.include(formDataString, 'name="anotherProperty"\r\n\r\nvalue');
        });

    it('Should return a form data containing the original object properties,'
    + ' even properties that contains array of objects', () => {
        const originalObject = {
            items: [{ property: 'value' }],
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        assert.include(formDataString, 'name="itemProperty1"\r\n\r\nvalue');
        assert.include(formDataString, 'name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains array', () => {
        const originalObject = {
            items: ['firstItem', 'secondItem'],
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        assert.include(formDataString, 'name="items"\r\n\r\n["firstItem","secondItem"]');
        assert.include(formDataString, 'name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains array with values that are objects and non-objects',
    () => {
        const originalObject = {
            item: ['firstItem', { arrayObjectProperty: 'value' }],
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        assert.include(formDataString, 'name="item1"\r\n\r\nfirstItem');
        assert.include(formDataString, 'name="itemArrayObjectProperty2"\r\n\r\nvalue');
        assert.include(formDataString, 'name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains a buffer', () => {
        const originalObject = {
            propertyBuffer: Buffer.from('value'),
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        assert.include(
            formDataString,
            'name="propertyBuffer"\r\nContent-Type: application/octet-stream\r\n\r\nvalue',
        );
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains a Stream', () => {
        const originalObject = {
            propertyStream: fs.createReadStream('http://nodejs.org/images/logo.png'),
        };

        const formData = convertObjectToFormData(originalObject);
        // eslint-disable-next-line dot-notation
        const formDataString = formData['_streams'][0].toString();

        assert.include(formDataString, 'name="propertyStream"');
        assert.include(formDataString, 'Content-Type: image/png');
    });

    it('Should return a form data containing the original object properties,'
    + ' ignoring properties that contains a function', () => {
        const originalObject = {
            property: 'value',
            propertyFunction: () => {},
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        assert.include(formDataString, 'name="property"\r\n\r\nvalue');
        assert.notInclude(formDataString, 'name="propertyFunction"');
    });
});
