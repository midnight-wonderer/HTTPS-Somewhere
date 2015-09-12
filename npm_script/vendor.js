var shell = require('gulp-shell');
var _ = require('underscore');

var libList = [
  'https://oss.maxcdn.com/rxjs/3.1.2/rx.min.js',
  'https://oss.maxcdn.com/rxjs/3.1.2/rx.async.min.js',
  'https://oss.maxcdn.com/rxjs/3.1.2/rx.binding.min.js',
  'https://oss.maxcdn.com/requirejs/2.1.20/require.min.js',
  'https://oss.maxcdn.com/react/0.13.3/react.min.js',
  'https://oss.maxcdn.com/jquery/2.1.4/jquery.min.js'
];

var filenamePattern = /\/([^#\?\\\/]+)(?:$|\?\#)/;
var downloadCommand = _.chain(libList)
  .map(function(url) {
    var matched = filenamePattern.exec(url);
    if (!matched) {
      return matched;
    }
    return 'curl ' + url + ' -o source/vendor/script/' + matched[1];
  })
  .compact()
  .value();

var vendoring = shell.task([
  'rm -rf source/vendor/*',
  'mkdir -p source/vendor/script']
  .concat(downloadCommand));
vendoring();
