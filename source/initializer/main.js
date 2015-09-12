requirejs.config({
  baseUrl: '',
  paths: {
    'rx': 'vendor/script/rx.min',
    'rx.async': 'vendor/script/rx.async.min',
    'rx.binding': 'vendor/script/rx.binding.min',
    'jquery': 'vendor/script/jquery.min'
  },
  'shim': {
    'rx.binding': ['rx']
  }
});

require(['initializer/option']);
