requirejs.config({
  baseUrl: '',
  paths: {
    'rx': 'vendor/rx.min',
    'rx.async': [
      'https://cdnjs.cloudflare.com/ajax/libs/rxjs/3.1.2/rx.async.min',
      'https://oss.maxcdn.com/rxjs/3.1.2/rx.async.min'
    ],
    'rx.binding': [
      'https://cdnjs.cloudflare.com/ajax/libs/rxjs/3.1.2/rx.binding.min',
      'https://oss.maxcdn.com/rxjs/3.1.2/rx.binding.min'
    ],
    jquery: 'vendor/jquery.min'
  },
  'shim': {
    'rx.binding': ['rx']
  }
});

require(['initializer/option']);
