# js-to-formdata
Function that converts the javascript object to an instance of [Form-Data](https://www.npmjs.com/package/form-data).

Making it possible and easy for you to convert nested objects directly to single-depth form data.

## Install

```
npm i js-to-formdata
```

## Usage

Include the module into your project:

```js
const convertObjectToFormData = require('js-to-formdata');
```

#### Object containing nested objects example:

```js
const convertObjectToFormData = require('js-to-formdata');

const originalObject = {
    property: {
        nestedProperty: 'value',
    },
    anotherProperty: 'value',
};

const formData = convertObjectToFormData(originalObject);
```

The example above produces form data equivalent to the result of executing the following commands using the form-data lib:

```js
form.append('propertyNestedProperty', 'value');
form.append('anotherProperty', 'value');
```

#### Object containing array example:

```js
const convertObjectToFormData = require('js-to-formdata');

const originalObjectWithArray = {
    items: [{ property: 'value' }],
    anotherProperty: 'value',
};

const formData = convertObjectToFormData(originalObject);
```

The example above produces form data equivalent to the result of executing the following commands using the form-data lib:

```js
form.append('itemProperty1', 'value');
form.append('anotherProperty', 'value');
```

#### Functions will be ignored:

```js
const convertObjectToFormData = require('js-to-formdata');

const originalObject = {
    propertyFunction: () => {},
    anotherProperty: 'value',
};

const formData = convertObjectToFormData(originalObject);
```

The example above produces form data equivalent to the result of executing the following commands using the form-data lib:

```js
form.append('anotherProperty', 'value');
```
