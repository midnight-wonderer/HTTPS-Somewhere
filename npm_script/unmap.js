var gulp = require('gulp');
var replace = require('gulp-replace');

gulp.src(['source/vendor/**/*.js'])
  .pipe(replace(/\r*\n\s*\/\/\s*#\s*sourceMappingURL\S*\s*(?:\n|$)/g, '\n'))
  .pipe(gulp.dest('build/vendor/'));
