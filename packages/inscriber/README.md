# @brave-js/inscriber

A Simple Javascript Class which is carved out with some features to offer the property bindings for the instances

[![NPM version](https://img.shields.io/npm/v/@brave-js/inscriber.svg)](https://www.npmjs.com/package/@brave-js/inscriber) [![gzip size](https://img.badgesize.io/https://unpkg.com/@brave-js/inscriber/dist/inscriber.js?compression=gzip)](https://www.npmjs.com/package/@brave-js/inscriber)

## Design

- `@brave-js/inscriber` distinct javascript class

## API

The scope of the API works only within the current object / instance of the class

### compute

Enables the usage of computed property within the current object / instance of the class

**Parameters**

- `name` name of the computed property

- `properties` array of properties that exists in the current object

- `method` callback function which to calculate the value of the computed property

## Usage
```javascript
import Inscriber from '@brave-js/inscriber';

// Create the `Person` Class extending the `Inscriber` Class
class Person extends Inscriber {
    constructor(obj) {
        super();
        this.firstName = obj.firstName;
        this.lastName = obj.lastName;
        return this;
    }
}

// Instantiate the `Person` Object
var person = new Person({
    firstName: 'John',
    lastName: 'Doe'
});

// Add Computed Property `fullName` to the person object
person.compute('fullName', ['firstName', 'lastName'], function() {
    return `${this.firstName} ${this.lastName}`;
});

// Access Computed Property `fullName` from the person object
person.fullName // => Prints `John Doe`

// Now any change to the properties `firstName` & `lastName` will be derived in `fullName`
person.firstName = 'Mr';
person.lastName = 'Rob';

person.fullName // => Prints `Mr Rob`
```

