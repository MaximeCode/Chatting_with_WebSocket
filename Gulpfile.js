const gulp = require('gulp');
const cleanCSS = require('gulp-clean-css');

// Task to minify CSS using the cleanCSS package
gulp.task('minify-css', function () {
  // Folder with files to minify
  return gulp.src('styles/*.css')
    .pipe(cleanCSS()) // Minify the CSS files
    .pipe(gulp.dest('dist')); // Destination for minified files
});

// Define a 'default' task that will run when we execute `gulp`
gulp.task('default', function () {
  // Watch for changes in CSS files in the styles folder
  gulp.watch('styles/*.css', gulp.series('minify-css'));
});