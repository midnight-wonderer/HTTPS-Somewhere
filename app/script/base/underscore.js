define(['underscore'], function(_) {
  _.mixin({
    // typescript style extension (copied from compiled typescript class)
    // 's' in the mixin name make it not conflict with underscore's extend
    extends: (this && this.__extends) || function(d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
  });
  return _;
});
