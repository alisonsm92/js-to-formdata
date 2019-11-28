# js-to-formdata
Function that converts the javascript object to an instance of [Form-Data](https://www.npmjs.com/package/form-data).

Making it possible and easy for you to convert nested objects directly to single-depth form data.

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

Use as exemplified by [Form-Data](https://www.npmjs.com/package/ documentation.

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
