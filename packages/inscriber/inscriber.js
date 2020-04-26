var Inscriber = function(compute) {
  var value, changed = true;

  return {
    compute: compute || function() {
      return undefined;
    },

    toggle: function() {
      changed = changed || true;
    },

    reset: function() {
      changed = changed && false;
    },

    value: function() {
      if (changed) {
        if (this.compute && typeof this.compute === "function") {
          value = this.compute();
        } else {
          value = undefined;
        }
        this.reset();
      }
      return value;
    }
  }
};

export default Inscriber;