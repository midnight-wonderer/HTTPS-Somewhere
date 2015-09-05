var watch = require('gulp-watch');
var shell = require('gulp-shell');
var invoke = require('require-uncached');
var moment = require('moment');

watch('source/*', function(){
  console.log('change detected ' + moment().format('H:mm:ss'));
  invoke('npm_script/build');
});
