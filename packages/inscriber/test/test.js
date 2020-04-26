const assert = require('chai').assert;
const sinon = require('sinon');

import Inscriber from '../inscriber';

describe('Inscriber Test', function() {
  it('check inscribe is instantiable', function() {
    let compute = () => {};
    let inscriber = Inscriber(compute);
    
    assert.equal(typeof inscriber, 'object');
    assert.equal(typeof inscriber.value, 'function');
    assert.equal(typeof inscriber.toggle, 'function');
    assert.equal(typeof inscriber.reset, 'function');
    assert.deepEqual(inscriber.compute, compute);
  });

  it('check inscribe compute exist by default', function() {
    let inscriber = Inscriber();
    
    assert.equal(typeof inscriber, 'object');
    assert.equal(typeof inscriber.value, 'function');
    assert.equal(typeof inscriber.toggle, 'function');
    assert.equal(typeof inscriber.reset, 'function');
    assert.equal(inscriber.compute(), undefined);
    assert.deepEqual(typeof inscriber.compute, 'function');
  });

  it('check inscribe did not recalculate the value', function() {
    let compute = sinon.fake();
    let inscriber = Inscriber(compute);

    inscriber.value();
    assert.ok(compute.called);
    compute.resetHistory();

    assert.notOk(compute.called);
    inscriber.value();
    assert.notOk(compute.called);
  });

  it('check inscribe recalculate the value on toggle', function() {
    let compute = sinon.fake();
    let inscriber = Inscriber(compute);

    inscriber.value();
    assert.ok(compute.called);
    compute.resetHistory();

    assert.notOk(compute.called);
    inscriber.toggle();
    inscriber.value();
    assert.ok(compute.called);
  });

  it('check inscribe did not recalculate the value on reset', function() {
    let compute = sinon.fake();
    let inscriber = Inscriber(compute);

    inscriber.value();
    assert.ok(compute.called);
    compute.resetHistory();

    assert.notOk(compute.called);
    inscriber.reset();
    inscriber.value();
    assert.notOk(compute.called);
  });

  it('check compute is returnable', function() {
    let compute = () => { return 1; };
    let inscriber = Inscriber(compute);

    assert.equal(inscriber.compute(), 1);
    assert.equal(inscriber.value(), 1);
  });

  it('check compute is not returnable', function() {
    let compute = {};
    let inscriber = Inscriber(compute);

    assert.deepEqual(inscriber.compute, compute);
    assert.equal(inscriber.value(), undefined);
  });
});