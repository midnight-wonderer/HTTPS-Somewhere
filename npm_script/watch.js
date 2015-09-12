var watch = require('gulp-watch');
var shell = require('gulp-shell');
var moment = require('moment');

watch('source/**/*', function() {
  console.log('change detected ' + moment().format('H:mm:ss'));
  shell.task('npm run build')();
});
