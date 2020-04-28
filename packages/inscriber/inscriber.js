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

  _resetBindings(name, properties) {
    properties.forEach(property => {
      let bindArray = this._bindings[property];
      bindArray.splice(bindArray.indexOf(name), 1);
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
  
    let propertyBinding = this._bindings[property];
    
    if (propertyBinding) {
      propertyBinding.push(name);
    } else {
      let propValue = this[property];
      this._bindings[property] = [name];
      Object.defineProperty(this, property, {
        get: function() {
          return propValue;
        },
        set: function(value) {
            propValue = value;
            that.toggle(property);
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
    if (nameTaken) {
      this._resetBindings(name, nameTaken.properties);
    } else {
      this._defineProperty(name);
    }

    // Call dataset always to keep properties and binding up-to-date
    this._setupDatasets(name, properties, method, nameTaken);

    // Call bindings always to keep properties and bindings up-to-date
    this._setupBindings(name);
  }
  
  toggle(property) {
    let bindings = this._bindings[property];
    bindings.forEach(binding => {
      let data = this._datasets[binding];
      data.changed = data.changed || true;
    });
  }
  
  reset(name, flag = false) {
    let data = this._datasets[name];
    data.changed = data.changed && flag;
  }
}

export default Inscriber;