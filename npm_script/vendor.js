var shell = require('gulp-shell');
var download = shell.task([
  'rm -rf source/vendor/*',
  'mkdir -p source/vendor/script',
  'curl https://oss.maxcdn.com/rxjs/3.1.2/rx.min.js -o source/vendor/script/rx.min.js',
  'curl https://oss.maxcdn.com/requirejs/2.1.20/require.min.js -o source/vendor/script/require.min.js',
  'curl https://oss.maxcdn.com/react/0.13.3/react.min.js -o source/vendor/script/react.min.js',
  'curl https://oss.maxcdn.com/jquery/2.1.4/jquery.min.js -o source/vendor/script/jquery.min.js'
]);
download();
