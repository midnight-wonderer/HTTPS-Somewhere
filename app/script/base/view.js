define(['backbone', 'underscore'], function(Backbone, _) {
  return (function(_super) {

    var BaseView = function(options) {
      // property can be override here
      // this.tagName = "li";

      // super constructor
      _super.call(this, options);
      // extend constructor functionality below
    };

    _.extends(BaseView, _super);

    // Add or override method
    // _.extend(BaseView.prototype, {
    //   foo: function() {
    //     return _super.prototype.foo.apply(this, arguments);
    //   }
    // });

    // remove native Backbone extend functionality
    // to enforce typescript based extends
    delete BaseView.extend;

    return BaseView;
  })(Backbone.View);
});
