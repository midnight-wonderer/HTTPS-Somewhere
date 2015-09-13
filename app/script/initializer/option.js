requirejs.config(window.requireConfig);

require(['base/view', 'backbone'], function(BaseView, Backbone) {
  console.log(BaseView);
  console.log(BaseView.prototype);
  b = new BaseView();
  console.log(b);
  console.log(Backbone.View);
  console.log(Backbone.View.prototype);
  window.testBase = BaseView;
  window.testBone = Backbone.View;
});
