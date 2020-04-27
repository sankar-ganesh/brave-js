class Inscriber {
  constructor() {
    this._datasets = {};
    this._bindings = {};
  }

  _setupDatasets(name, properties, method) {
    this._datasets[name] = {
      properties: properties,
      method: method,
      changed: true
    };
  }

  _defineProperty(name) {
    var that = this;
    Object.defineProperty(this, name, {
      get: function() {
        return that._getValue(name);
      }
    });
  }

  _setupBindings(name) {
    let data = this._datasets[name],
        properties = data && data.properties;
    
    properties.forEach((property) => {
      this._bindProperty(name, property);
    });
  }
  
  _getValue(name) {
    let data = this._datasets[name],
        isChanged = data && data.changed,
        method = data && data.method;
  
    if (isChanged) {
      data.value = method.apply(this);
      this.reset(name);
    }
    return data.value;
  }
  
  _bindProperty(name, property) {
    var that = this;
  
    let data = this._datasets[name],
        binding = this._bindings[property];
    
    if (binding) {
      if (!binding.includes(name)) {
        binding.push(name);
      }
    } else {
      let propValue = this[property];
      this._bindings[property] = [name];
      Object.defineProperty(this, property, {
        get: function() {
          return propValue;
        },
        set: function(value) {
            propValue = value;
            that.toggle(name);
        }
      }); 
    }
  }

  compute(name, properties, method) {
    if (!name) {
      return;
    }
    if (!properties || properties.length === 0) {
      return;
    }
    if (!method || typeof method !== 'function') {
      return;
    }

    let nameTaken = this._datasets[name];
    // Call dataset always to keep properties and binding up-to-date
    this._setupDatasets(name, properties, method);
    
    // Define property only when name is not taken
    if (!nameTaken) {
      this._defineProperty(name);
    }

    // Call bindings always to keep properties and bindings up-to-date
    this._setupBindings(name);
  }
  
  toggle(name) {
    let data = this._datasets[name];
    data.changed = data.changed || true;
  }
  
  reset(name) {
    let data = this._datasets[name];
    data.changed = data.changed && false;
  }
}

export default Inscriber;