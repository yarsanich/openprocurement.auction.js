const gulp          = require('gulp'),
      notify        = require('gulp-notify'),
      concat        = require('gulp-concat'),
      bower         = require('gulp-bower'),
      vendorFiles   = require('gulp-main-bower-files'),
      gulpFilter    = require('gulp-filter'),
      source        = require('vinyl-source-stream'),
      cleanCSS      = require('gulp-clean-css'),
      browserify    = require('browserify'),
      babelify      = require('babelify'),
      ngAnnotate    = require('browserify-ngannotate'),
      fileinclude   = require('gulp-file-include'),
      merge         = require('merge-stream');

function  interceptErrors(error) {
  let args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end');
}

const buildDir = 'build/';
const outDir = '_attachments/';


const sources = {
  styles: 'src/**/*.css',
  html: {
    indexPage: 'templates/index.html',
    archivePage: 'templates/archive.html',
    auctionPage: 'templates/tender.html'
  },
  js: {
    listApp: 'src/app/index.js',
    archiveApp: 'src/app/archive.js',
    auctionApp: 'src/app/auction.js',
  },
  img: {
    png: 'src/assets/img/*.png'
  }
};

gulp.task('bower', () => {
  return bower();
});


gulp.task('png-images', () => {
  return gulp.src(sources.img.png)
    .on('error', interceptErrors)
    .pipe(gulp.dest(buildDir));
});


gulp.task('all-js', () => {
    let filterJS = gulpFilter('**/*.js', { restore: true });
    return gulp.src('./bower.json')
    .pipe(vendorFiles({base: "src/lib"}))
        .pipe(filterJS)
        .pipe(concat('vendor.js'))
        .pipe(filterJS.restore)
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

gulp.task('archivePage', () => {
    return gulp.src(sources.html.archivePage)
      .on('error', interceptErrors)
      .pipe(gulp.dest(buildDir));
});

gulp.task('auctionPage', () => {
    return gulp.src(sources.html.auctionPage)
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

gulp.task('archiveApp', () => {
  let b = browserify({entries: sources.js.archiveApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('archive.js'))
    .pipe(gulp.dest(buildDir));
});

gulp.task('auctionApp', () => {
  let b = browserify({entries: sources.js.auctionApp});
  return b
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    .pipe(source('auction.js'))
    .pipe(gulp.dest(buildDir));
});


gulp.task('build', ['bower', 'all-js', 'css', 'png-images', 'listingPage', 'listingApp', 'archivePage', 'archiveApp', 'auctionApp', 'auctionPage'], () => {

  let css = gulp.src(`${buildDir}/bundle.css`)
      .pipe(gulp.dest(outDir));

  let listPage = gulp.src(`${buildDir}/index.html`)
      .pipe(gulp.dest(outDir));

  let listApp = gulp.src(`${buildDir}/index.js`)
      .pipe(gulp.dest(outDir));

  let vendor_js = gulp.src(`${buildDir}/vendor.js`)
      .pipe(gulp.dest(outDir));

  let archivePage = gulp.src(`${buildDir}/archive.html`)
      .pipe(gulp.dest(outDir));

  let archiveApp = gulp.src(`${buildDir}/archive.js`)
      .pipe(gulp.dest(outDir));

  let auctionPage = gulp.src(`${buildDir}/tender.html`)
      .pipe(gulp.dest(outDir));

  let auctionApp = gulp.src(`${buildDir}/auction.js`)
      .pipe(gulp.dest(outDir));

  let png = gulp.src("build/*.png")
      .pipe(gulp.dest(outDir));

  return merge(css, png, listPage, listApp, vendor_js, auctionPage, auctionApp);
});


