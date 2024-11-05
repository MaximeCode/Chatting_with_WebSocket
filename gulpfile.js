let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
// Task to minify css using package cleanCSs
gulp.task('minify-css', () => {
  // Folder with files to minify
  return gulp.src('./styles/style.css')
    //The method pipe() allow you to chain multiple tasks together 
    //I execute the task to minify the files
    .pipe(cleanCSS())
    //I define the destination of the minified files with the method dest
    .pipe(gulp.dest('./dist/'));
});

// Default task that will run when `gulp` is executed in the terminal
gulp.task('default', function () {
  // Use `gulp.watch` to watch for changes and run 'minify-css' when `style.css` is modified
  gulp.watch('./styles/style.css', gulp.series('minify-css'));
});
