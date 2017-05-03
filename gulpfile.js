const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
      concat        = require('gulp-concat'),
      cleanCSS      = require('gulp-clean-css'),
      merge         = require('merge-stream');

function  interceptErrors(error) {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
};


const buildDir = 'build/';
const outDir = '_attachments/';


const sources = {
  styles: 'src/**/*.css',
  html: {
    indexPage: 'templates/index.html'
  }
};


gulp.task('css', () => {
  return gulp.src(sources.styles)
    .pipe(concat('bundle.css'))
    .pipe(cleanCSS())
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir));
});


gulp.task('listingPage', () => {
    return gulp.src(sources.html.indexPage)
      .on('error', interceptErrors)
      .pipe(gulp.dest(buildDir));
})


gulp.task('build', ['css', 'listingPage'], () => {

  let css = gulp.src(`${buildDir}/bundle.css`)
      .pipe(gulp.dest(outDir));

  let listPage = gulp.src(`${buildDir}/index.html`)
      .pipe(gulp.dest(outDir));
  return merge(css, listPage);
});

