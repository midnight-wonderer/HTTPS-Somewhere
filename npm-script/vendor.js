var shell = require('gulp-shell');
var download = shell.task([
  'rm -rf vendor/*',
  'curl https://oss.maxcdn.com/rxjs/3.1.2/rx.min.js -o vendor/rx.min.js',
]);
download();
