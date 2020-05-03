const assert = require('chai').assert;
const sinon = require('sinon');

import Inscriber from '../inscriber';

describe('Inscriber Test', function() {
  it('check inscriber is instantiable', function() {
    let inscriber = new Inscriber();
    assert.equal(typeof inscriber, 'object');
    assert.equal(typeof inscriber.compute, 'function');
    assert.equal(typeof inscriber.destruct, 'function');
    assert.equal(typeof inscriber.toggle, 'function');
    assert.equal(typeof inscriber.reset, 'function');
  });

  it('check inscriber compute has default value', function() {
    let inscriber = new Inscriber();
    inscriber.compute('fullName', ['firstName', 'lastName'], void 0);
    assert.equal(inscriber.fullName, void 0);
  });

  it('check inscriber compute has no default value', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';    

    inscriber.compute('', [], void 0);
    assert.equal(inscriber.fullName, void 0);

    inscriber.compute('fullName', [], void 0);
    assert.equal(inscriber.fullName, void 0);

    inscriber.compute('fullName', ['firstName', 'lastName'], {});
    assert.equal(inscriber.fullName, void 0);
  });

  it('check inscriber compute works as expected', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
    inscriber.firstName = 'Selva';
    assert.equal(inscriber.fullName, 'Selva Ganesh');
    inscriber.lastName = 'Raj';
    assert.equal(inscriber.fullName, 'Selva Raj');
  });

  it('check inscriber compute function is cached', function() {
    let compute = sinon.fake();
    let inscriber = new Inscriber();
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);

    let fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();

    fullName = inscriber.fullName;
    assert.notOk(compute.called);
    
    inscriber.firstName = 'Sankar';
    fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();

    inscriber.lastName = 'Ganesh';
    fullName = inscriber.fullName;
    assert.ok(compute.called);
  });

  it('check inscriber compute function cache is destroyed on toggle', function() {
    let compute = sinon.fake();
    let inscriber = new Inscriber();
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);

    let fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();
    
    inscriber.toggle('firstName');
    fullName = inscriber.fullName;
    assert.ok(compute.called);
  });

  it('check inscriber compute function cache is maintained on reset', function() {
    let compute = sinon.fake();
    let inscriber = new Inscriber();
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);

    let fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();
    
    inscriber.firstName = 'Tom';
    inscriber.reset('fullName');
    fullName = inscriber.fullName;
    assert.notOk(compute.called);
    compute.resetHistory();
    
    inscriber.lastName = 'John';
    inscriber.reset('fullName', true);
    fullName = inscriber.fullName;
    assert.ok(compute.called);
  });

  it('check inscriber compute allows removal of binding properties', function() {
    let compute = sinon.fake();
    let inscriber = new Inscriber();
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);

    let fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();
    
    inscriber.compute('fullName', ['lastName'], compute);
    fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();
    inscriber.firstName = 'John';
    fullName = inscriber.fullName;
    assert.notOk(compute.called);
    compute.resetHistory();
    inscriber.lastName = 'John';
    fullName = inscriber.fullName;
    assert.ok(compute.called);
  });

  it('check inscriber compute callback / method allows overriding', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');

    compute = function() {
      return `Mr. ${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Mr. Sankar Ganesh');
  });

  it('check inscriber compute allows updating binding properties', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');

    compute = function() {
      return `Mr. ${this.firstName} ${this.lastName} ${this.designation}`;
    };
    inscriber.designation = 'MSc';
    inscriber.compute('fullName', ['firstName', 'lastName', 'designation'], compute);
    assert.equal(inscriber.fullName, 'Mr. Sankar Ganesh MSc');
  });

  it('check inscriber compute allows multiple binding properties', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
    inscriber.street = 'bull street, london';
    let computeAddress = function() {
      return `${this.firstName} ${this.lastName} ${this.street}`;
    };
    inscriber.compute('address', ['firstName', 'lastName', 'street'], computeAddress);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
    assert.equal(inscriber.address, 'Sankar Ganesh bull street, london');
  });

  it('check inscriber destruct method', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');

    inscriber.destruct('fullName');
    assert.equal(inscriber.firstName, 'Sankar');
    assert.equal(inscriber.lastName, 'Ganesh');
    assert.equal(inscriber.fullName, 'Sankar Ganesh');

    inscriber.firstName = 'John';
    inscriber.lastName = 'Doe';
    assert.equal(inscriber.firstName, 'John');
    assert.equal(inscriber.lastName, 'Doe');
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
  });

  it('check inscriber allows recomputing', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');

    inscriber.destruct('fullName');
    assert.equal(inscriber.firstName, 'Sankar');
    assert.equal(inscriber.lastName, 'Ganesh');
    assert.equal(inscriber.fullName, 'Sankar Ganesh');

    inscriber.firstName = 'John';
    inscriber.lastName = 'Doe';
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    assert.equal(inscriber.firstName, 'John');
    assert.equal(inscriber.lastName, 'Doe');
    assert.equal(inscriber.fullName, 'John Doe');
  });

  it('check inscriber destruct retains property definition when there are multiple binding properties', function() {
    let inscriber = new Inscriber();
    inscriber.firstName = 'Sankar';
    inscriber.lastName = 'Ganesh';
    let compute = function() {
      return `${this.firstName} ${this.lastName}`;
    };
    inscriber.street = 'bull street, london';
    let computeAddress = function() {
      return `${this.firstName} ${this.lastName} ${this.street}`;
    };

    inscriber.compute('fullName', ['firstName', 'lastName'], compute);
    inscriber.compute('address', ['firstName', 'lastName', 'street'], computeAddress);
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
    assert.equal(inscriber.address, 'Sankar Ganesh bull street, london');

    inscriber.destruct('fullName');
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
    assert.equal(inscriber.address, 'Sankar Ganesh bull street, london');

    inscriber.firstName = 'John';
    inscriber.lastName = 'Doe';
    assert.equal(inscriber.fullName, 'Sankar Ganesh');
    assert.equal(inscriber.address, 'John Doe bull street, london');
  });

  it('check inscriber destruct restricts deletion', function() {
    let compute = sinon.fake();
    let inscriber = new Inscriber();
    inscriber.compute('fullName', ['firstName', 'lastName'], compute);

    let fullName = inscriber.fullName;
    assert.ok(compute.called);
    compute.resetHistory();

    inscriber.destruct('fullname'); // Incorrect name
    assert.notOk(compute.called);
  });

  it('check inscriber allows multi-level property definition', function() {
    let inscriber = new Inscriber();
    inscriber.name = {
      firstName: 'Sankar',
      lastName: 'Ganesh'
    };
    let compute = function() {
      return `${this.name.firstName} ${this.name.lastName}`;
    };

    inscriber.compute('name.fullName', ['name.firstName', 'name.lastName'], compute);
    assert.equal(inscriber.name.fullName, 'Sankar Ganesh');
    
    inscriber.name.firstName = 'John';
    inscriber.name.lastName = 'Doe';
    assert.equal(inscriber.name.fullName, 'John Doe');

    inscriber.name = {
      firstName: 'John',
      lastName: 'Doe'
    };
    assert.equal(inscriber.name.fullName, void 0);
  });

  it('check inscriber throws error for unknown property definition', function() {
    let inscriber = new Inscriber();
    inscriber.name = {
      firstName: 'Sankar',
      lastName: 'Ganesh',
      address: {
        street: 'park street',
        city: 'chennai'
      }
    };
    let compute = function() {
      return `${this.name.firstName} ${this.name.lastName}`;
    };

    try {
      inscriber.compute('name.fullName', ['namee.firstName', 'namee.lastName'], compute);
    } catch(e) {
      assert.equal(e, 'Error: namee not found');
    }

    try {
      inscriber.compute('name.address.location', ['name.addresss.location', 'name.addresss.location'], compute);
    } catch(e) {
      assert.equal(e, 'Error: addresss not found');
    }

    try {
      inscriber.compute('', [], compute);
    } catch(e) {
      assert.equal(e, 'Error: XPATH not found');
    }
  });

  it('check inscriber getter & setter listens to binding properties', function() {
    let inscriber = new Inscriber();
    inscriber.name = {};

    inscriber.set('name.firstName', 'John');
    assert.equal(inscriber.get('name.firstName'), 'John');

    inscriber.set('name.lastName', 'Doe');
    assert.equal(inscriber.get('name.lastName'), 'Doe');

    let compute = function() {
      return `${this.name.firstName} ${this.name.lastName}`;
    };
    inscriber.compute('name.fullName', ['name.firstName', 'name.lastName'], compute);
    assert.equal(inscriber.get('name.fullName'), 'John Doe');
    assert.equal(inscriber.get('name.maiden'), void 0);
    
    inscriber.set('name.firstName', 'John');
    inscriber.set('name.lastName', 'Mathews');
    assert.equal(inscriber.name.fullName, 'John Mathews');
  });
});