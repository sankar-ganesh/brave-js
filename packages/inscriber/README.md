# @brave-js/inscriber

A Simple Javascript Class which is carved out with some features to offer the property bindings for the instances

[![NPM version](https://img.shields.io/npm/v/@brave-js/inscriber.svg)](https://www.npmjs.com/package/@brave-js/inscriber) [![gzip size](https://img.badgesize.io/https://unpkg.com/@brave-js/inscriber/dist/inscriber.js?compression=gzip)](https://www.npmjs.com/package/@brave-js/inscriber)

## Installation

* `yarn add @brave-js/inscriber`

## Design

- `Inscriber` a distinct javascript class

## Inscriber Class

- The scope of the API works only within the current object / instance of the class

- Allows addition & deletion to property binding list

- Property binding change event is delegated via the setters / getters

- Allows deletion of computed property

- Computed Property value is cached. The callback is never called unless the cache is reset

- Last but not least, you can force enable / disable cache. Default is enable cache

### compute

Enables the usage of computed property within the current object / instance of the class

**Parameters**

- `name` name of the computed property

- `properties` array of properties that exists in the current object

- `method` callback function which to calculate the value of the computed property

### Usage
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

### destruct

Destructs the computed property within the current object / instance of the class

**Parameters**

- `name` name of the computed property

### Usage
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

// Destructing the Computed Property will retain the value but no longer linked to the bindings
person.destruct('fullName');

// Now any change to the properties `firstName` & `lastName` will not be derived in `fullName`
person.firstName = 'Mr';
person.lastName = 'Rob';

person.fullName // => Prints `John Doe`
```

### toggle

Disables the cache for all computed property of the binding property. Will be useful to reset cache at any point of time.

**Parameters**

- `property` name of the bindings

### Usage

- `firstName`, `lastName`, `street`, `city` are binding properties

### reset

Enables the cache for the computed property. Will be useful to read the old value & new value after a change

**Parameters**

- `name` name of the computed property

### Usage

- `fullName`, `address` are computed property for binding properties `firstName`, `lastName`, `street`, `city`