var shell = require('gulp-shell');
var build = shell.task([
  'rm -rf build/*',
  'cp -r source/* build'
]);
build();
