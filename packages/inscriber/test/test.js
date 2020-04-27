const assert = require('chai').assert;
const sinon = require('sinon');

import Inscriber from '../inscriber';

describe('Inscriber Test', function() {
  it('check inscriber is instantiable', function() {
    let inscriber = new Inscriber();
    assert.equal(typeof inscriber, 'object');
    assert.equal(typeof inscriber.compute, 'function');
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
    
    inscriber.toggle('fullName');
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
    
    inscriber.reset('fullName');
    fullName = inscriber.fullName;
    assert.notOk(compute.called);
  });

  it('check inscriber compute allows overriding', function() {
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

  it('check inscriber compute allows overriding properties', function() {
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

  it('check inscriber compute allows multiple property bindings', function() {
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
});