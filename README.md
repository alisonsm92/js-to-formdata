# js-to-formdata ![](https://github.com/alisonsm92/js-to-formdata/workflows/CI/badge.svg) <span class="badge-npmversion"><a href="https://npmjs.org/package/js-to-formdata" title="View this project on NPM"><img src="https://img.shields.io/npm/v/js-to-formdata.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/js-to-formdata" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/js-to-formdata.svg" alt="NPM downloads" /></a></span>

Module that makes it possible and easy for you to convert nested javascript objects directly to [Form-Data](https://www.npmjs.com/package/form-data).

Supports objects with property values of the [primitives javascript types](https://javascript.info/types), as well as arrays, buffers and file streams.

## Install

```
npm i js-to-formdata
```

## Usage

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

### Integration with other libraries

Use as exemplified by [Form-Data](https://www.npmjs.com/package/) documentation.

#### Request

Form submission using  [request](https://github.com/request/request):

```javascript
const convertObjectToFormData = require('js-to-formdata');

const originalObject = {
    property: 'value',
};

const formData = convertObjectToFormData(originalObject);

request.post({url:'http://service.com/upload', formData: formData}, function(err, httpResponse, body) {
  if (err) {
    return console.error('upload failed:', err);
  }
  console.log('Upload successful!  Server responded with:', body);
});
```

#### node-fetch

You can submit a form using [node-fetch](https://github.com/bitinn/node-fetch):

```javascript
const convertObjectToFormData = require('js-to-formdata');

const originalObject = {
    property: 'value',
};

const formData = convertObjectToFormData(originalObject);

fetch('http://example.com', { method: 'POST', body: form })
    .then(function(res) {
        return res.json();
    }).then(function(json) {
        console.log(json);
    });
```

#### axios

You can also submit a form using [axios](https://github.com/axios/axios):
```javascript
const convertObjectToFormData = require('js-to-formdata');

const originalObject = {
    property: 'value',
};

const formData = convertObjectToFormData(originalObject);

axios.post('http://example.com', form, {
  headers: {
    ...formHeaders,
  },
})
.then(response => response)
.catch(error => error)
```

### Custom options
You can use custom options [Form-Data](https://www.npmjs.com/package/), passing to function module an instance of FormData with the already defined options.

Example:

```javascript
const FormData = require('form-data');
const convertObjectToFormData = require('js-to-formdata');

const form = new FormData({ maxDataSize: 20971520 });

const originalObject = {
    property: 'value',
};

const formData = convertObjectToFormData(originalObject, { form });

```