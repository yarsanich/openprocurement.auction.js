const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
      concat        = require('gulp-concat'),
      source        = require('vinyl-source-stream'),
      cleanCSS      = require('gulp-clean-css'),
      browserify    = require('browserify'),
      babelify      = require('babelify'),
      ngAnnotate    = require('browserify-ngannotate'),
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
  },
  js: {
    listApp: 'src/app/index.js'
  },
  img: {
    png: 'src/assets/img/*.png'
  }
};


gulp.task('png-images', () => {
  return gulp.src(sources.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir));
});


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
});

gulp.task('listingApp', () => {
  let b = browserify({entries: sources.js.listApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('index.js'))
    .pipe(gulp.dest(buildDir));

});

gulp.task('build', ['css', 'png-images', 'listingPage', 'listingApp'], () => {

  let css = gulp.src(`${buildDir}/bundle.css`)
      .pipe(gulp.dest(outDir));

  let listPage = gulp.src(`${buildDir}/index.html`)
      .pipe(gulp.dest(outDir));

  let listApp = gulp.src(`${buildDir}/index.js`)
      .pipe(gulp.dest(outDir));

  let png = gulp.src("build/*.png")
      .pipe(gulp.dest(outDir));

  return merge(css, png, listPage, listApp);
});

