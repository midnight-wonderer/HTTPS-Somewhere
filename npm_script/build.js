var shell = require('gulp-shell');
var gulp = require('gulp');
var replace = require('gulp-replace');

var build = shell.task([
  'rm -rf build',
  'cp -r source build'
]);
build();

gulp.src(['source/vendor/**/*.js'])
  .pipe(replace(/\r*\n\s*\/\/\s*#\s*sourceMappingURL\S*\s*(?:\n|$)/g, '\n'))
  .pipe(gulp.dest('build/vendor/'));
