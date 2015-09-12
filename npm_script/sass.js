var gulp = require('gulp');
var sass = require('gulp-sass');

gulp.src('source/style/main.scss')
  .pipe(sass.sync().on('error', sass.logError))
  .pipe(gulp.dest('build/style/'));
