/*
 *  @class Inscriber
 *  @description A simple javascript slass which is carved out with some features 
 *                to offer the property bindings for the instances
 * 
 */
class Inscriber {
  /*
   *  @constructor
   *  @description Instantiates the appropriate properties to handle the datasets and bindings
   * 
   *  @return {Object} instance of the class `Inscriber`
   */
  constructor() {
    this._datapaths = {};
    this._datasets = {};
    this._bindings = {};
  }

  /*
   *  @private @method _convertXPathToObject
   *  @description Converts the XPATH to Object
   * 
   *  @param {string} xpath       XPATH of the object
   *  @return {Object} retVal     {obj, parent, leaf}
   */
  _convertXPathToObject(xpath) {
    let retVal = {
      source: null,
      parent: null,
      leaf: null
    };

    if (this._datapaths[xpath]) {
      return this._datapaths[xpath];
    }

    let lastIndex = xpath && xpath.lastIndexOf('.'),
        parent = (lastIndex !== -1)? xpath && xpath.slice(0, lastIndex) : null,
        leaf = xpath && xpath.slice(lastIndex+1);
    
    if (parent) {
      parent = parent.split('.');
      retVal.parent = parent;

      parent.map((path, index) => {
        if (retVal.source === null) {
          retVal.source = this[path];
          if (retVal.source === void 0) {
            throw new Error(`${path} not found`);
          }
        } else {
          retVal.source = retVal.source && retVal.source[path] || void 0;
          if (retVal.source === void 0) {
            throw new Error(`${path} not found`);
          }
        }
      });
    }
    if (leaf) {
      retVal.leaf = leaf;
      if (parent === null) {
        retVal.source = this;
      }
    }
    if (retVal.parent === null && retVal.leaf === null) {
      throw new Error('XPATH not found');
    }
    return retVal;
  }

  /*
   *  @private @method _checkForDataPaths
   *  @description Identified the datapaths for the xpaths
   * 
   *  @param {string} name        Name of the computed property
   *  @param {Array} properties   Array of dependent properties
   *  @return void 0
   */
  _checkForDataPaths(name, properties) {
    this._datapaths[name] = this._convertXPathToObject(name);
    properties.forEach(property => {
      this._datapaths[property] = this._convertXPathToObject(property);
    });
  }

  /*
   *  @private @method _setupDatasets
   *  @description Setup the datasets for the computed property along with the dependent properties and compute callback
   * 
   *  @param {string} name        Name of the computed property
   *  @param {Array} properties   Array of dependent properties
   *  @param {Function} method    Compute callback function returns the value
   *  @return void 0
   */
  _setupDatasets(name, properties, method) {
    this._datasets[name] = {
      properties: properties,
      method: method,
      changed: true
    };
  }

  /*
   *  @private @method _resetDatasets
   *  @description Resets the datasets for the computed property
   * 
   *  @param {string} name        Name of the computed property
   *  @return void 0
   */
  _resetDatasets(name) {
    delete this._datasets[name];
  }

  /*
   *  @private @method _defineProperty
   *  @description Registers the getter method for the computed property
   * 
   *  @param {string} name        Name of the computed property
   *  @return void 0
   */
  _defineProperty(name) {
    var that = this;
    var datapath = this._datapaths[name];
    Object.defineProperty(datapath.source, datapath.leaf, {
      configurable: true,
      get: function() {
        return that._getValue(name);
      }
    });
  }

  /*
   *  @private @method _redefineProperty
   *  @description Removes the property getter
   * 
   *  @param {string} name        Name of the computed property
   *  @return void 0
   */
  _redefineProperty(name) {
    let datapath = this._datapaths[name],
        dataObj = datapath.source[datapath.leaf],
        propvalue = dataObj;
    delete datapath.source[datapath.leaf];
    datapath.source[datapath.leaf] = propvalue;
  }

  /*
   *  @private @method _resetBindings
   *  @description Resets the dependent property mapping for the computed property and allows to remap
   * 
   *  @param {string} name        Name of the computed property
   *  @param {Array} properties   Array of dependent properties
   *  @return void 0
   */
  _resetBindings(name, properties) {
    properties.forEach(property => {
      let bindArray = this._bindings[property];
      // Remove binding mapping
      bindArray.splice(bindArray.indexOf(name), 1);

      // Reset property binding
      if (bindArray.length === 0) {
        delete this._bindings[property];
        this._redefineProperty(property);
      }
    });
  }

  /*
   *  @private @method _setupBindings
   *  @description Setup the binding for the computed property
   * 
   *  @param {string} name        Name of the computed property
   *  @return void 0
   */
  _setupBindings(name) {
    let data = this._datasets[name],
        properties = data && data.properties;
    
    properties.forEach((property) => {
      this._bindProperty(name, property);
    });
  }

  /*
   *  @private @method _getValue
   *  @description Calculates and returns the value for the computed property
   * 
   *  @param {string} name        Name of the computed property
   *  @return {Object} data       Data Value of the computed property
   */
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

  /*
   *  @private @method _bindProperty
   *  @description Setup the setter / getter for the dependent property
   * 
   *  @param {string} name        Name of the computed property
   *  @param {Array} property     Name of the dependent property
   *  @return void 0
   */
  _bindProperty(name, property) {
    var that = this;
  
    let propertyBinding = this._bindings[property];
    
    if (propertyBinding) {
      propertyBinding.push(name);
    } else {
      let datapath = this._datapaths[property],
          dataObj = datapath.source[datapath.leaf];
      let propValue = dataObj;
      this._bindings[property] = [name];
      Object.defineProperty(datapath.source, datapath.leaf, {
        configurable: true,
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

  /*
   *  @method compute
   *  @description Setup the bindings & datasets for the computed property
   * 
   *  @param {string} name        Name of the computed property
   *  @param {Array} properties   Array of dependent properties
   *  @param {Function} method    Compute callback function returns the value
   *  @return void 0
   */
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

    // If there xpaths identifies the datapaths
    this._checkForDataPaths(name, properties);

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

  /*
   *  @method destruct
   *  @description Removes / Destruct the bindings
   * 
   *  @param {string} name          Name of the computed property
   *  @return void 0
   */
  destruct(name) {
    let nameTaken = this._datasets[name];
    if (nameTaken) {
      this._resetBindings(name, nameTaken.properties);
      this._redefineProperty(name);
      this._resetDatasets(name);
    }
  }

  /*
   *  @method set
   *  @description Sets the value for property XPATH
   * 
   *  @param {string} xpath         XPATH of the property
   *  @param {Object} value         Value of the property
   *  @return void 0
   */
  set(xpath, value) {
    let datapath = this._convertXPathToObject(xpath);
    if (datapath.source && datapath.leaf) {
      datapath.source[datapath.leaf] = value;
    }
  }

  /*
   *  @method get
   *  @description Gets the value for property XPATH
   * 
   *  @param {string} xpath         XPATH of the property
   *  @return void 0
   */
  get(xpath) {
    let datapath = this._convertXPathToObject(xpath);
    return datapath.source[datapath.leaf];
  }

  /*
   *  @method toggle
   *  @description Resets the cache of all computed properties for the dependent property
   *                so it recalculate when getter is called
   * 
   *  @param {string} property        Name of the dependent property
   *  @return void 0
   */
  toggle(property) {
    let bindings = this._bindings[property];
    bindings.forEach(binding => {
      let data = this._datasets[binding];
      data.changed = data.changed || true;
    });
  }

  /*
   *  @method reset
   *  @description Enables / Disables the cache of the computed properties
   *                so it won't recalculate when getter is called
   * 
   *  @param {string} property        Name of the computed property
   *  @param {string} flag            TRUE disables the cache, FALSE enables the cache
   *  @return void 0
   */
  reset(name, flag = false) {
    let data = this._datasets[name];
    data.changed = data.changed && flag;
  }
}

export default Inscriber;