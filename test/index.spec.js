// @ts-nocheck
const fs = require('fs');
const convertObjectToFormData = require('../index');

describe('Convert object to form data', () => {
    it('Should return a form data containing the original object properties', () => {
        const originalObject = {
            property: 'value',
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        Object.keys(originalObject).forEach((property) => {
            expect(formDataString).toContain(`name="${property}"\r\n\r\n${originalObject[property]}`);
        });
    });

    it('Should return a form data containing the original object properties, even nested properties', () => {
        const originalObject = {
            property: {
                nestedProperty: 'value',
            },
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain('name="propertyNestedProperty"\r\n\r\nvalue');
        expect(formDataString).toContain('name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
    + ' even properties that contains array of objects', () => {
        const originalObject = {
            items: [{ property: 'value' }],
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain('name="itemProperty1"\r\n\r\nvalue');
        expect(formDataString).toContain('name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains array', () => {
        const originalObject = {
            items: ['firstItem', 'secondItem'],
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain('name="items"\r\n\r\n["firstItem","secondItem"]');
        expect(formDataString).toContain('name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains array with values that are objects and non-objects', () => {
        const originalObject = {
            item: ['firstItem', { arrayObjectProperty: 'value' }],
            anotherProperty: 'value',
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain('name="item1"\r\n\r\nfirstItem');
        expect(formDataString).toContain('name="itemArrayObjectProperty2"\r\n\r\nvalue');
        expect(formDataString).toContain('name="anotherProperty"\r\n\r\nvalue');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains a buffer', () => {
        const originalObject = {
            propertyBuffer: Buffer.from('value'),
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain(
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

        expect(formDataString).toContain('name="propertyStream"');
        expect(formDataString).toContain('Content-Type: image/png');
    });

    it('Should return a form data containing the original object properties,'
        + ' even properties that contains a Symbol', () => {
        const originalObject = {
            propertySymbol: Symbol('value'),
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain('name="propertySymbol"\r\n\r\nSymbol(value)');
    });

    it('Should return a form data containing the original object properties,'
    + ' ignoring properties that contains not supported types', () => {
        const originalObject = {
            property: 'value',
            propertyFunction: () => {},
        };

        const formData = convertObjectToFormData(originalObject);
        const formDataString = formData.getBuffer().toString();

        expect(formDataString).toContain('name="property"\r\n\r\nvalue');
        expect(formDataString).not.toContain('name="propertyFunction"');
    });
});
