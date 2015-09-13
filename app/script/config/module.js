window.requireConfig = {
  baseUrl: '/app/script',
  paths: {
    'rx': '/vendor/script/rx.min',
    'rx.async': '/vendor/script/rx.async.min',
    'rx.binding': '/vendor/script/rx.binding.min',
    'jquery': '/vendor/script/jquery.min',
    'underscore': '/vendor/script/underscore.min',
    'backbone': '/vendor/script/backbone.min'
  },
  'shim': {
    'rx.binding': ['rx']
  },
  map: {
    '*': {'underscore': 'base/underscore'},
    'base/underscore': {'underscore': 'underscore'}
  }
};
