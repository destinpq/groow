const originalSome = Array.prototype.some; Array.prototype.some = function(...args) { return this == null ? false : originalSome.apply(this, args); };
